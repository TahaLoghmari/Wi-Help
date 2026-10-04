using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain.Entities;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Repositories;

namespace Modules.Reviews.Features.LikeReview;

internal sealed class LikeReviewCommandHandler(
    IReviewRepository reviews,
    ILogger<LikeReviewCommandHandler> logger) : ICommandHandler<LikeReviewCommand>
{
    public async Task<Result> Handle(LikeReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Liking review {ReviewId} by user {UserId}",
            command.ReviewId, command.UserId);

        // Check if review exists
        var reviewExists = await reviews.ReviewExistsAsync(command.ReviewId, cancellationToken);

        if (!reviewExists)
        {
            logger.LogWarning("Review not found for ID {ReviewId}", command.ReviewId);
            return Result.Failure(ReviewErrors.NotFound(command.ReviewId));
        }

        // Check if already liked
        var existingLike = await reviews.GetLikeAsync(command.ReviewId, command.UserId, cancellationToken);

        if (existingLike != null)
        {
            logger.LogWarning(
                "Review {ReviewId} already liked by user {UserId}",
                command.ReviewId, command.UserId);
            return Result.Failure(ReviewErrors.AlreadyLiked(command.ReviewId, command.UserId));
        }

        var like = new ReviewLike(command.ReviewId, command.UserId);

        reviews.AddLike(like);
        await reviews.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} liked by user {UserId}", command.ReviewId, command.UserId);

        return Result.Success();
    }
}
