using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Reviews.Domain;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.EditReview;

public class EditReviewCommandHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<EditReviewCommandHandler> logger) : ICommandHandler<EditReviewCommand>
{
    public async Task<Result> Handle(EditReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Editing review {ReviewId} for patient {PatientId}",
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
                "Patient {PatientId} attempted to edit review {ReviewId} owned by patient {OwnerId}",
                command.PatientId, command.ReviewId, review.PatientId);
            return Result.Failure(ReviewErrors.NotOwner(command.ReviewId, command.PatientId));
        }

        // Validate rating
        if (command.Rating < 1 || command.Rating > 5)
        {
            return Result.Failure(ReviewErrors.InvalidRating(command.Rating));
        }

        // Validate comment
        if (string.IsNullOrWhiteSpace(command.Comment))
        {
            return Result.Failure(ReviewErrors.CommentRequired());
        }

        // Validate comment length
        const int maxCommentLength = 2000;
        if (command.Comment.Length > maxCommentLength)
        {
            logger.LogWarning("Review comment exceeds maximum length of {MaxLength}", maxCommentLength);
            return Result.Failure(ReviewErrors.CommentTooLong(maxCommentLength));
        }

        // Update the review
        review.Update(command.Comment, command.Rating);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} updated successfully", command.ReviewId);

        return Result.Success();
    }
}
