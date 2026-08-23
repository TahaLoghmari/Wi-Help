using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Abstractions;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Infrastructure.Database;

internal sealed class ReviewOperationPorts(ReviewsDbContext dbContext) :
    ISubmitReviewPort,
    IEditReviewPort,
    IDeleteReviewPort,
    ILikeReviewPort,
    IUnlikeReviewPort,
    IReplyToReviewPort,
    IEditReplyPort,
    IDeleteReplyPort,
    IGetReviewsPort,
    IGetReviewsForAdminPort,
    IGetReviewStatsPort
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

    public async Task AddAsync(Review review, CancellationToken cancellationToken)
    {
        dbContext.Reviews.Add(review);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    async Task<Review?> IEditReviewPort.GetAsync(Guid reviewId, CancellationToken cancellationToken) =>
        await dbContext.Reviews.FirstOrDefaultAsync(review => review.Id == reviewId, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);

    async Task<Review?> IDeleteReviewPort.GetAsync(Guid reviewId, CancellationToken cancellationToken) =>
        await dbContext.Reviews.FirstOrDefaultAsync(review => review.Id == reviewId, cancellationToken);

    public async Task DeleteAsync(Review review, CancellationToken cancellationToken)
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
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<bool> ReviewExistsAsync(Guid reviewId, CancellationToken cancellationToken) =>
        dbContext.Reviews.AnyAsync(review => review.Id == reviewId, cancellationToken);

    async Task<ReviewLike?> ILikeReviewPort.GetLikeAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewLikes.FirstOrDefaultAsync(
            like => like.ReviewId == reviewId && like.UserId == userId,
            cancellationToken);

    async Task<ReviewLike?> IUnlikeReviewPort.GetLikeAsync(
        Guid reviewId,
        Guid userId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewLikes.FirstOrDefaultAsync(
            like => like.ReviewId == reviewId && like.UserId == userId,
            cancellationToken);

    public async Task AddLikeAsync(ReviewLike like, CancellationToken cancellationToken)
    {
        dbContext.ReviewLikes.Add(like);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveLikeAsync(ReviewLike like, CancellationToken cancellationToken)
    {
        dbContext.ReviewLikes.Remove(like);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Review?> GetReviewAsync(Guid reviewId, CancellationToken cancellationToken) =>
        dbContext.Reviews
            .AsNoTracking()
            .FirstOrDefaultAsync(review => review.Id == reviewId, cancellationToken);

    public async Task AddReplyAsync(ReviewReply reply, CancellationToken cancellationToken)
    {
        dbContext.ReviewReplies.Add(reply);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    async Task<ReviewReply?> IEditReplyPort.GetAsync(
        Guid reviewId,
        Guid replyId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewReplies.FirstOrDefaultAsync(
            reply => reply.Id == replyId && reply.ReviewId == reviewId,
            cancellationToken);

    async Task<ReviewReply?> IDeleteReplyPort.GetAsync(
        Guid reviewId,
        Guid replyId,
        CancellationToken cancellationToken) =>
        await dbContext.ReviewReplies.FirstOrDefaultAsync(
            reply => reply.Id == replyId && reply.ReviewId == reviewId,
            cancellationToken);

    public async Task DeleteAsync(ReviewReply reply, CancellationToken cancellationToken)
    {
        dbContext.ReviewReplies.Remove(reply);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<ReviewsPage> GetAsync(
        Expression<Func<Review, bool>> filter,
        int page,
        int pageSize,
        Guid callerUserId,
        CancellationToken cancellationToken)
    {
        var baseQuery = dbContext.Reviews
            .AsNoTracking()
            .Where(filter)
            .OrderByDescending(review => review.CreatedAt);

        var totalCount = await baseQuery.CountAsync(cancellationToken);
        var reviews = await baseQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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
            .Where(like => reviewIds.Contains(like.ReviewId) && like.UserId == callerUserId)
            .Select(like => like.ReviewId)
            .ToListAsync(cancellationToken);
        var replies = await dbContext.ReviewReplies
            .AsNoTracking()
            .Where(reply => reviewIds.Contains(reply.ReviewId))
            .OrderBy(reply => reply.CreatedAt)
            .ToListAsync(cancellationToken);

        return new ReviewsPage(reviews, totalCount, likeCounts, likedReviewIds, replies);
    }

    public async Task<AdminReviewsPage> GetAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Reviews.CountAsync(cancellationToken);
        var reviews = await dbContext.Reviews
            .OrderByDescending(review => review.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new AdminReviewsPage(reviews, totalCount);
    }

    public async Task<ReviewStats> GetAsync(Guid subjectId, CancellationToken cancellationToken)
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
