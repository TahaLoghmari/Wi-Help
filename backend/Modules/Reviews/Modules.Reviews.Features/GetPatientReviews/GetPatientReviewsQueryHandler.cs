using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;
using Modules.Identity.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Reviews.Features.GetProfessionalReviews;

namespace Modules.Reviews.Features.GetPatientReviews;

public sealed class GetPatientReviewsQueryHandler(
    ReviewsDbContext dbContext,
    IProfessionalModuleApi professionalsApi,
    IIdentityModuleApi identityApi,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetPatientReviewsQuery, PaginationResultDto<GetPatientReviewsDto>>
{
    public async Task<Result<PaginationResultDto<GetPatientReviewsDto>>> Handle(
        GetPatientReviewsQuery query,
        CancellationToken cancellationToken)
    {
        IQueryable<Review> baseQuery = dbContext.Reviews
            .AsNoTracking()
            .Where(r => r.PatientId == query.PatientId && r.Type == ReviewType.PatientReview)
            .OrderByDescending(r => r.CreatedAt);

        // Pagination
        PaginationResultDto<Review> paginatedReviews = await PaginationResultDto<Review>.CreateAsync(
            baseQuery, query.Page, query.PageSize, cancellationToken);

        var reviewIds = paginatedReviews.Items.Select(r => r.Id).ToList();

        // Get all professionalIds from current patient's reviews
        var professionalIds = paginatedReviews.Items.Select(r => r.ProfessionalId).Distinct().ToList();

        // Get all professional data from current patient's reviews using professionalIds
        var professionalsResult = await professionalsApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        if (!professionalsResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetPatientReviewsDto>>.Failure(professionalsResult.Error);
        }

        // Every ProfessionalDto that has a review for this patient
        Dictionary<Guid, ProfessionalDto> professionalsMap = professionalsResult.Value.ToDictionary(p => p.Id);

        // Get likes count for each review
        var likesCounts = await dbContext.ReviewLikes
            .AsNoTracking()
            .Where(rl => reviewIds.Contains(rl.ReviewId))
            .GroupBy(rl => rl.ReviewId)
            .Select(g => new { ReviewId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ReviewId, x => x.Count, cancellationToken);

        // Get isLiked status for current user
        HashSet<Guid> likedReviewIds = new();
        if (query.CurrentUserId.HasValue)
        {
            var likedReviews = await dbContext.ReviewLikes
                .AsNoTracking()
                .Where(rl => reviewIds.Contains(rl.ReviewId) && rl.UserId == query.CurrentUserId.Value)
                .Select(rl => rl.ReviewId)
                .ToListAsync(cancellationToken);
            likedReviewIds = likedReviews.ToHashSet();
        }

        // Get replies for each review
        var replies = await dbContext.ReviewReplies
            .AsNoTracking()
            .Where(rr => reviewIds.Contains(rr.ReviewId))
            .OrderBy(rr => rr.CreatedAt)
            .ToListAsync(cancellationToken);

        // Get patient info to check if reply authors are the patient
        var patientResult = await patientsApi.GetPatientsByIdsAsync([query.PatientId], cancellationToken);
        var patientUserId = patientResult.IsSuccess && patientResult.Value.Any()
            ? patientResult.Value.First().UserId
            : (Guid?)null;

        // Get user IDs from replies
        var replyUserIds = replies.Select(r => r.UserId).Distinct().ToList();
        var usersResult = await identityApi.GetUsersByIdsAsync(replyUserIds, cancellationToken);
        if (!usersResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetPatientReviewsDto>>.Failure(usersResult.Error);
        }

        var usersMap = usersResult.Value.ToDictionary(u => u.Id);

        // Check which users are patients (reply author matches the patient's user ID)
        var patientUserIds = new HashSet<Guid>();
        if (patientUserId.HasValue)
        {
            patientUserIds.Add(patientUserId.Value);
        }

        // Group replies by review ID
        var repliesByReview = replies
            .GroupBy(r => r.ReviewId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(r =>
                {
                    var user = usersMap.GetValueOrDefault(r.UserId);
                    return new ReviewReplyDto(
                        r.Id,
                        r.ReviewId,
                        r.UserId,
                        r.Comment,
                        r.CreatedAt,
                        r.UpdatedAt,
                        user?.FirstName,
                        user?.LastName,
                        user?.ProfilePictureUrl,
                        patientUserIds.Contains(r.UserId) // IsProfessional is false if it's the patient replying
                    );
                }).ToList()
            );

        // Map to DTOs
        var reviewDtos = paginatedReviews.Items.Select(review =>
        {
            var professional = professionalsMap.GetValueOrDefault(review.ProfessionalId);
            var reviewReplies = repliesByReview.GetValueOrDefault(review.Id, new List<ReviewReplyDto>());

            return new GetPatientReviewsDto(
                review.Id,
                review.PatientId,
                review.ProfessionalId,
                review.Comment,
                review.Rating,
                review.CreatedAt,
                review.UpdatedAt,
                professional!,
                likesCounts.GetValueOrDefault(review.Id, 0),
                reviewReplies.Count,
                likedReviewIds.Contains(review.Id),
                reviewReplies
            );
        }).ToList();

        return Result<PaginationResultDto<GetPatientReviewsDto>>.Success(new PaginationResultDto<GetPatientReviewsDto>
        {
            Items = reviewDtos,
            Page = paginatedReviews.Page,
            PageSize = paginatedReviews.PageSize,
            TotalCount = paginatedReviews.TotalCount
        });
    }
}
