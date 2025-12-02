using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.DeleteReview;

public class DeleteReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<DeleteReviewCommandHandler> logger) : ICommandHandler<DeleteReviewCommand>
{
    public async Task<Result> Handle(DeleteReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Deleting review {ReviewId} for patient {PatientId}",
            command.ReviewId, command.PatientId);

        // Find the review
        var review = await reviewsDbContext.Reviews
            .FirstOrDefaultAsync(r => r.Id == command.ReviewId, cancellationToken);

        if (review is null)
        {
            logger.LogWarning("Review not found with ID {ReviewId}", command.ReviewId);
            return Result.Failure(ReviewErrors.ReviewNotFound(command.ReviewId));
        }

        // Check ownership
        if (review.PatientId != command.PatientId)
        {
            logger.LogWarning(
                "Patient {PatientId} attempted to delete review {ReviewId} owned by patient {OwnerId}",
                command.PatientId, command.ReviewId, review.PatientId);
            return Result.Failure(ReviewErrors.NotOwner(command.ReviewId, command.PatientId));
        }

        // Delete related likes
        var likes = await reviewsDbContext.ReviewLikes
            .Where(l => l.ReviewId == command.ReviewId)
            .ToListAsync(cancellationToken);
        reviewsDbContext.ReviewLikes.RemoveRange(likes);

        // Delete related replies
        var replies = await reviewsDbContext.ReviewReplies
            .Where(r => r.ReviewId == command.ReviewId)
            .ToListAsync(cancellationToken);
        reviewsDbContext.ReviewReplies.RemoveRange(replies);

        // Delete the review
        reviewsDbContext.Reviews.Remove(review);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} deleted successfully", command.ReviewId);

        return Result.Success();
    }
}
