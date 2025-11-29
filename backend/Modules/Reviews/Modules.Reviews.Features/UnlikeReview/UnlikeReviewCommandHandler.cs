using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;

namespace Modules.Reviews.Features.UnlikeReview;

public class UnlikeReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<UnlikeReviewCommandHandler> logger) : ICommandHandler<UnlikeReviewCommand>
{
    public async Task<Result> Handle(UnlikeReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Unliking review {ReviewId} by user {UserId}",
            command.ReviewId, command.UserId);

        var like = await reviewsDbContext.ReviewLikes
            .FirstOrDefaultAsync(
                rl => rl.ReviewId == command.ReviewId && rl.UserId == command.UserId,
                cancellationToken);

        if (like == null)
        {
            logger.LogWarning(
                "Like not found for review {ReviewId} by user {UserId}",
                command.ReviewId, command.UserId);
            return Result.Failure(ReviewErrors.LikeNotFound(command.ReviewId, command.UserId));
        }

        reviewsDbContext.ReviewLikes.Remove(like);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} unliked by user {UserId}", command.ReviewId, command.UserId);

        return Result.Success();
    }
}

