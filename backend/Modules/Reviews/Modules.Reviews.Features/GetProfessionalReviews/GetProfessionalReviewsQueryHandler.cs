using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;
using Modules.Identity.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Reviews.Features.GetProfessionalReviews;

public sealed class GetProfessionalReviewsQueryHandler(
    ReviewsDbContext dbContext,
    IPatientsModuleApi patientsApi,
    IIdentityModuleApi identityApi,
    IProfessionalModuleApi professionalsApi)
    : IQueryHandler<GetProfessionalReviewsQuery, PaginationResultDto<GetProfessionalReviewsDto>>
{
    public async Task<Result<PaginationResultDto<GetProfessionalReviewsDto>>> Handle(
        GetProfessionalReviewsQuery query,
        CancellationToken cancellationToken)
    {
        IQueryable<Review> baseQuery = dbContext.Reviews
            .AsNoTracking()
            .Where(r => r.ProfessionalId == query.ProfessionalId)
            .OrderByDescending(r => r.CreatedAt);

        // Pagination
        PaginationResultDto<Review> paginatedReviews = await PaginationResultDto<Review>.CreateAsync(
            baseQuery, query.Page, query.PageSize, cancellationToken);

        var reviewIds = paginatedReviews.Items.Select(r => r.Id).ToList();

        // Get all patientIds from current professional's reviews
        var patientIds = paginatedReviews.Items.Select(r => r.PatientId).Distinct().ToList();

        // Get all patient data from current professional's reviews using patientIds
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        if (!patientsResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetProfessionalReviewsDto>>.Failure(patientsResult.Error);
        }

        // Every PatientDto that has a review for this professional
        Dictionary<Guid, PatientDto> patientsMap = patientsResult.Value.ToDictionary(p => p.Id);

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

        // Get professional info to check if reply authors are the professional
        var professionalResult = await professionalsApi.GetProfessionalsByIdsAsync([query.ProfessionalId], cancellationToken);
        var professionalUserId = professionalResult.IsSuccess && professionalResult.Value.Any()
            ? professionalResult.Value.First().UserId
            : (Guid?)null;

        // Get user IDs from replies
        var replyUserIds = replies.Select(r => r.UserId).Distinct().ToList();
        var usersResult = await identityApi.GetUsersByIdsAsync(replyUserIds, cancellationToken);
        if (!usersResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetProfessionalReviewsDto>>.Failure(usersResult.Error);
        }

        var usersMap = usersResult.Value.ToDictionary(u => u.Id);

        // Check which users are professionals (reply author matches the professional's user ID)
        var professionalUserIds = new HashSet<Guid>();
        if (professionalUserId.HasValue)
        {
            professionalUserIds.Add(professionalUserId.Value);
        }

        // Group replies by review ID
        var repliesByReview = replies
            .GroupBy(r => r.ReviewId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var dtos = paginatedReviews.Items.Select(r =>
        {
            var likesCount = likesCounts.GetValueOrDefault(r.Id, 0);
            var isLiked = likedReviewIds.Contains(r.Id);
            var reviewReplies = repliesByReview.GetValueOrDefault(r.Id, new List<ReviewReply>())
                .Select(reply =>
                {
                    usersMap.TryGetValue(reply.UserId, out var user);
                    var isProfessional = professionalUserIds.Contains(reply.UserId);
                    return new ReviewReplyDto(
                        reply.Id,
                        reply.ReviewId,
                        reply.UserId,
                        reply.Comment,
                        reply.CreatedAt,
                        reply.UpdatedAt,
                        user?.FirstName,
                        user?.LastName,
                        user?.ProfilePictureUrl,
                        isProfessional);
                })
                .ToList();

            return r.ToDto(patientsMap, likesCount, reviewReplies.Count, isLiked, reviewReplies);
        }).ToList();

        return Result<PaginationResultDto<GetProfessionalReviewsDto>>.Success(new PaginationResultDto<GetProfessionalReviewsDto>
        {
            Items = dtos,
            Page = paginatedReviews.Page,
            PageSize = paginatedReviews.PageSize,
            TotalCount = paginatedReviews.TotalCount
        });
    }
}

