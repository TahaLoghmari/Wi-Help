using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Repositories;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Infrastructure.Database.Repositories;

internal sealed class ReviewRepository(ReviewsDbContext dbContext) : IReviewRepository
{
    public Task<bool> ExistsAsync(
        Guid patientId,
        Guid professionalId,
        ReviewType type,
        CancellationToken cancellationToken) =>
        dbContext.Reviews.AnyAsync(
            review => review.PatientId == patientId
                      && review.ProfessionalId == professionalId
                      && review.Type == type,
            cancellationToken);

    public void Add(Review review) => dbContext.Reviews.Add(review);

    public async Task<Review?> GetByIdAsync(Guid reviewId, CancellationToken cancellationToken) =>
        await dbContext.Reviews.FirstOrDefaultAsync(review => review.Id == reviewId, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);

    public async Task RemoveAsync(Review review, CancellationToken cancellationToken)
    {
        var likes = await dbContext.ReviewLikes
            .Where(like => like.ReviewId == review.Id)
            .ToListAsync(cancellationToken);
        dbContext.ReviewLikes.RemoveRange(likes);

        var replies = await dbContext.ReviewReplies
            .Where(reply => reply.ReviewId == review.Id)
            .ToListAsync(cancellationToken);
        dbContext.ReviewReplies.RemoveRange(replies);

        dbContext.Reviews.Remove(review);
    }

    public Task<bool> ReviewExistsAsync(Guid reviewId, CancellationToken cancellationToken) =>
        dbContext.Reviews.AnyAsync(review => review.Id == reviewId, cancellationToken);

    public async Task<ReviewLike?> GetLikeAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewLikes.FirstOrDefaultAsync(
            like => like.ReviewId == reviewId && like.UserId == userId,
            cancellationToken);

    public void AddLike(ReviewLike like) => dbContext.ReviewLikes.Add(like);

    public void RemoveLike(ReviewLike like) => dbContext.ReviewLikes.Remove(like);

    public Task<Review?> GetReviewAsync(Guid reviewId, CancellationToken cancellationToken) =>
        dbContext.Reviews
            .AsNoTracking()
            .FirstOrDefaultAsync(review => review.Id == reviewId, cancellationToken);

    public void AddReply(ReviewReply reply) => dbContext.ReviewReplies.Add(reply);

    public async Task<ReviewReply?> GetReplyAsync(
        Guid reviewId,
        Guid replyId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewReplies.FirstOrDefaultAsync(
            reply => reply.Id == replyId && reply.ReviewId == reviewId,
            cancellationToken);

    public void RemoveReply(ReviewReply reply) => dbContext.ReviewReplies.Remove(reply);

    public async Task<ReviewsPage> GetPageAsync(ReviewSearchCriteria criteria, CancellationToken cancellationToken)
    {
        var baseQuery = dbContext.Reviews
            .AsNoTracking()
            .Where(review =>
                (criteria.ProfessionalSubjectId.HasValue
                 && review.ProfessionalId == criteria.ProfessionalSubjectId.Value
                 && review.Type == ReviewType.ProfessionalReview)
                || (criteria.PatientSubjectId.HasValue
                    && review.PatientId == criteria.PatientSubjectId.Value
                    && review.Type == ReviewType.PatientReview)
                || (criteria.ProfessionalReviewerId.HasValue
                    && review.ProfessionalId == criteria.ProfessionalReviewerId.Value
                    && review.Type == ReviewType.PatientReview)
                || (criteria.PatientReviewerId.HasValue
                    && review.PatientId == criteria.PatientReviewerId.Value
                    && review.Type == ReviewType.ProfessionalReview))
            .OrderByDescending(review => review.CreatedAt);

        var totalCount = await baseQuery.CountAsync(cancellationToken);
        var reviews = await baseQuery
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .ToListAsync(cancellationToken);

        var reviewIds = reviews.Select(review => review.Id).ToList();
        var likeCounts = await dbContext.ReviewLikes
            .AsNoTracking()
            .Where(like => reviewIds.Contains(like.ReviewId))
            .GroupBy(like => like.ReviewId)
            .Select(group => new { ReviewId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(result => result.ReviewId, result => result.Count, cancellationToken);
        var likedReviewIds = await dbContext.ReviewLikes
            .AsNoTracking()
            .Where(like => reviewIds.Contains(like.ReviewId) && like.UserId == criteria.CallerUserId)
            .Select(like => like.ReviewId)
            .ToListAsync(cancellationToken);
        var replies = await dbContext.ReviewReplies
            .AsNoTracking()
            .Where(reply => reviewIds.Contains(reply.ReviewId))
            .OrderBy(reply => reply.CreatedAt)
            .ToListAsync(cancellationToken);

        return new ReviewsPage(reviews, totalCount, likeCounts, likedReviewIds, replies);
    }

    public async Task<AdminReviewsPage> GetAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Reviews.CountAsync(cancellationToken);
        var reviews = await dbContext.Reviews
            .OrderByDescending(review => review.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new AdminReviewsPage(reviews, totalCount);
    }

    public async Task<ReviewStats> GetStatsAsync(Guid subjectId, CancellationToken cancellationToken)
    {
        var stats = await dbContext.Reviews
            .AsNoTracking()
            .Where(review =>
                (review.ProfessionalId == subjectId && review.Type == ReviewType.ProfessionalReview)
                || (review.PatientId == subjectId && review.Type == ReviewType.PatientReview))
            .GroupBy(_ => 1)
            .Select(group => new { Average = group.Average(review => (double)review.Rating), Count = group.Count() })
            .FirstOrDefaultAsync(cancellationToken);

        return stats is null ? new ReviewStats(0, 0) : new ReviewStats(stats.Average, stats.Count);
    }
}
