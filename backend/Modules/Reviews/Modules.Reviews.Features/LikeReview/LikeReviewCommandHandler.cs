using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;

namespace Modules.Reviews.Features.LikeReview;

public class LikeReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<LikeReviewCommandHandler> logger) : ICommandHandler<LikeReviewCommand>
{
    public async Task<Result> Handle(LikeReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Liking review {ReviewId} by user {UserId}",
            command.ReviewId, command.UserId);

        // Check if review exists
        var reviewExists = await reviewsDbContext.Reviews
            .AnyAsync(r => r.Id == command.ReviewId, cancellationToken);

        if (!reviewExists)
        {
            logger.LogWarning("Review not found for ID {ReviewId}", command.ReviewId);
            return Result.Failure(ReviewErrors.ReviewNotFound(command.ReviewId));
        }

        // Check if already liked
        var existingLike = await reviewsDbContext.ReviewLikes
            .FirstOrDefaultAsync(
                rl => rl.ReviewId == command.ReviewId && rl.UserId == command.UserId,
                cancellationToken);

        if (existingLike != null)
        {
            logger.LogWarning(
                "Review {ReviewId} already liked by user {UserId}",
                command.ReviewId, command.UserId);
            return Result.Failure(ReviewErrors.AlreadyLiked(command.ReviewId, command.UserId));
        }

        var like = new ReviewLike(command.ReviewId, command.UserId);

        reviewsDbContext.ReviewLikes.Add(like);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} liked by user {UserId}", command.ReviewId, command.UserId);

        return Result.Success();
    }
}

