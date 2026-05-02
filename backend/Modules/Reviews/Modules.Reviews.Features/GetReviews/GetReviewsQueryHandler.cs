using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Identity.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.GetReviews;

internal sealed class GetReviewsQueryHandler(
    ReviewsDbContext dbContext,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalsApi,
    IIdentityModuleApi identityApi)
    : IQueryHandler<GetReviewsQuery, PaginationResultDto<ReviewDto>>
{
    public async Task<Result<PaginationResultDto<ReviewDto>>> Handle(
        GetReviewsQuery query,
        CancellationToken cancellationToken)
    {
        IQueryable<Review> baseQuery = dbContext.Reviews.AsNoTracking();

        baseQuery = ApplyFilter(baseQuery, query);
        baseQuery = baseQuery.OrderByDescending(r => r.CreatedAt);

        var paginatedReviews = await PaginationResultDto<Review>.CreateAsync(
            baseQuery, query.Page, query.PageSize, cancellationToken);

        if (paginatedReviews.Items.Count == 0)
        {
            return Result<PaginationResultDto<ReviewDto>>.Success(new PaginationResultDto<ReviewDto>
            {
                Items = [],
                Page = paginatedReviews.Page,
                PageSize = paginatedReviews.PageSize,
                TotalCount = paginatedReviews.TotalCount
            });
        }

        var reviewIds = paginatedReviews.Items.Select(r => r.Id).ToList();

        // Batch-fetch likes counts
        var likesCounts = await dbContext.ReviewLikes
            .AsNoTracking()
            .Where(rl => reviewIds.Contains(rl.ReviewId))
            .GroupBy(rl => rl.ReviewId)
            .Select(g => new { ReviewId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ReviewId, x => x.Count, cancellationToken);

        // Current user liked reviews
        var likedReviewIds = await dbContext.ReviewLikes
            .AsNoTracking()
            .Where(rl => reviewIds.Contains(rl.ReviewId) && rl.UserId == query.CallerUserId)
            .Select(rl => rl.ReviewId)
            .ToListAsync(cancellationToken);
        var likedSet = likedReviewIds.ToHashSet();

        // Batch-fetch replies
        var replies = await dbContext.ReviewReplies
            .AsNoTracking()
            .Where(rr => reviewIds.Contains(rr.ReviewId))
            .OrderBy(rr => rr.CreatedAt)
            .ToListAsync(cancellationToken);

        // Resolve reply author info
        var replyUserIds = replies.Select(r => r.UserId).Distinct().ToList();
        var replyUsersMap = new Dictionary<Guid, (string FirstName, string LastName, string? ProfilePictureUrl)>();
        if (replyUserIds.Count > 0)
        {
            var usersResult = await identityApi.GetUsersByIdsAsync(replyUserIds, cancellationToken);
            if (usersResult.IsSuccess)
            {
                foreach (var u in usersResult.Value)
                    replyUsersMap[u.Id] = (u.FirstName, u.LastName, u.ProfilePictureUrl);
            }
        }

        var repliesByReview = replies
            .GroupBy(r => r.ReviewId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(r =>
                {
                    replyUsersMap.TryGetValue(r.UserId, out var user);
                    return new ReviewReplyDto(
                        r.Id, r.ReviewId, r.UserId, r.Comment,
                        r.CreatedAt, r.UpdatedAt,
                        user.FirstName, user.LastName, user.ProfilePictureUrl);
                }).ToList());

        // Resolve review author info
        var authorMap = await BuildAuthorMap(paginatedReviews.Items, cancellationToken);

        var dtos = paginatedReviews.Items.Select(r =>
        {
            var authorKey = GetAuthorKey(r);
            authorMap.TryGetValue(authorKey, out var author);

            var reviewReplies = repliesByReview.GetValueOrDefault(r.Id, []);

            return new ReviewDto(
                r.Id, r.Comment, r.Rating, r.Type,
                r.CreatedAt, r.UpdatedAt,
                author ?? new ReviewAuthorDto(Guid.Empty, "Unknown", "Unknown", null),
                likesCounts.GetValueOrDefault(r.Id, 0),
                reviewReplies.Count,
                likedSet.Contains(r.Id),
                reviewReplies);
        }).ToList();

        return Result<PaginationResultDto<ReviewDto>>.Success(new PaginationResultDto<ReviewDto>
        {
            Items = dtos,
            Page = paginatedReviews.Page,
            PageSize = paginatedReviews.PageSize,
            TotalCount = paginatedReviews.TotalCount
        });
    }

    /// <summary>
    /// Applies the subject/reviewer filter with role-based enforcement.
    /// </summary>
    private static IQueryable<Review> ApplyFilter(IQueryable<Review> baseQuery, GetReviewsQuery query)
    {
        if (query.SubjectId.HasValue)
        {
            var sid = query.SubjectId.Value;
            bool isOwnId = sid == query.CallerPatientId || sid == query.CallerProfessionalId;

            if (isOwnId)
            {
                // Viewing own reviews (both types where I'm the subject)
                return baseQuery.Where(r =>
                    (r.ProfessionalId == sid && r.Type == ReviewType.ProfessionalReview)
                    || (r.PatientId == sid && r.Type == ReviewType.PatientReview));
            }

            // Not own profile — enforce role-based access:
            // Professionals can view patient-subject reviews; patients can view professional-subject reviews
            if (query.CallerProfessionalId.HasValue)
            {
                return baseQuery.Where(r =>
                    r.PatientId == sid && r.Type == ReviewType.PatientReview);
            }

            return baseQuery.Where(r =>
                r.ProfessionalId == sid && r.Type == ReviewType.ProfessionalReview);
        }

        if (query.ReviewerId.HasValue)
        {
            var rid = query.ReviewerId.Value;
            return baseQuery.Where(r =>
                (r.PatientId == rid && r.Type == ReviewType.ProfessionalReview)
                || (r.ProfessionalId == rid && r.Type == ReviewType.PatientReview));
        }

        // Default: current user as subject
        if (query.CallerProfessionalId.HasValue)
        {
            return baseQuery.Where(r =>
                r.ProfessionalId == query.CallerProfessionalId.Value
                && r.Type == ReviewType.ProfessionalReview);
        }

        if (query.CallerPatientId.HasValue)
        {
            return baseQuery.Where(r =>
                r.PatientId == query.CallerPatientId.Value
                && r.Type == ReviewType.PatientReview);
        }

        // Fallback: no results (should not happen for authenticated users)
        return baseQuery.Where(_ => false);
    }

    /// <summary>
    /// Builds a lookup of (role, entityId) → ReviewAuthorDto for all review authors in the page.
    /// The author is the patient for ProfessionalReview, the professional for PatientReview.
    /// </summary>
    private async Task<Dictionary<(ReviewType, Guid), ReviewAuthorDto>> BuildAuthorMap(
        List<Review> reviews, CancellationToken cancellationToken)
    {
        var result = new Dictionary<(ReviewType, Guid), ReviewAuthorDto>();

        // Gather patient author IDs (ProfessionalReview → author is patient)
        var patientAuthorIds = reviews
            .Where(r => r.Type == ReviewType.ProfessionalReview)
            .Select(r => r.PatientId)
            .Distinct()
            .ToList();

        // Gather professional author IDs (PatientReview → author is professional)
        var professionalAuthorIds = reviews
            .Where(r => r.Type == ReviewType.PatientReview)
            .Select(r => r.ProfessionalId)
            .Distinct()
            .ToList();

        if (patientAuthorIds.Count > 0)
        {
            var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientAuthorIds, cancellationToken);
            if (patientsResult.IsSuccess)
            {
                foreach (var p in patientsResult.Value)
                {
                    result[(ReviewType.ProfessionalReview, p.Id)] =
                        new ReviewAuthorDto(p.Id, p.FirstName, p.LastName, p.ProfilePictureUrl);
                }
            }
        }

        if (professionalAuthorIds.Count > 0)
        {
            var professionalsResult = await professionalsApi.GetProfessionalsByIdsAsync(
                professionalAuthorIds, cancellationToken);
            if (professionalsResult.IsSuccess)
            {
                foreach (var p in professionalsResult.Value)
                {
                    result[(ReviewType.PatientReview, p.Id)] =
                        new ReviewAuthorDto(p.Id, p.FirstName, p.LastName, p.ProfilePictureUrl);
                }
            }
        }

        return result;
    }

    private static (ReviewType, Guid) GetAuthorKey(Review review)
    {
        return review.Type == ReviewType.ProfessionalReview
            ? (ReviewType.ProfessionalReview, review.PatientId)
            : (ReviewType.PatientReview, review.ProfessionalId);
    }
}
