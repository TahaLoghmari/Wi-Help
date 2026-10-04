using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Repositories;

namespace Modules.Reviews.Features.UnlikeReview;

internal sealed class UnlikeReviewCommandHandler(
    IReviewRepository reviews,
    ILogger<UnlikeReviewCommandHandler> logger) : ICommandHandler<UnlikeReviewCommand>
{
    public async Task<Result> Handle(UnlikeReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Unliking review {ReviewId} by user {UserId}",
            command.ReviewId, command.UserId);

        var like = await reviews.GetLikeAsync(command.ReviewId, command.UserId, cancellationToken);

        if (like == null)
        {
            logger.LogWarning(
                "Like not found for review {ReviewId} by user {UserId}",
                command.ReviewId, command.UserId);
            return Result.Failure(ReviewErrors.LikeNotFound(command.ReviewId, command.UserId));
        }

        reviews.RemoveLike(like);
        await reviews.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} unliked by user {UserId}", command.ReviewId, command.UserId);

        return Result.Success();
    }
}
