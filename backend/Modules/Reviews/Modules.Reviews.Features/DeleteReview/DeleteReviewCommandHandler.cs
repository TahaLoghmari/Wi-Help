using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.DeleteReview;

internal sealed class DeleteReviewCommandHandler(
    ReviewsDbContext dbContext,
    ILogger<DeleteReviewCommandHandler> logger) : ICommandHandler<DeleteReviewCommand>
{
    public async Task<Result> Handle(DeleteReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting review {ReviewId}", command.ReviewId);

        var review = await dbContext.Reviews
            .FirstOrDefaultAsync(r => r.Id == command.ReviewId, cancellationToken);

        if (review is null)
            return Result.Failure(ReviewErrors.NotFound(command.ReviewId));

        if (!command.IsAdmin)
        {
            bool isAuthor =
                (review.Type == ReviewType.ProfessionalReview
                    && command.CallerPatientId.HasValue
                    && review.PatientId == command.CallerPatientId.Value)
                || (review.Type == ReviewType.PatientReview
                    && command.CallerProfessionalId.HasValue
                    && review.ProfessionalId == command.CallerProfessionalId.Value);

            if (!isAuthor)
                return Result.Failure(ReviewErrors.NotAuthor(command.ReviewId));
        }

        // Clean up related likes and replies before deleting the review
        var likes = await dbContext.ReviewLikes
            .Where(l => l.ReviewId == command.ReviewId)
            .ToListAsync(cancellationToken);
        dbContext.ReviewLikes.RemoveRange(likes);

        var replies = await dbContext.ReviewReplies
            .Where(r => r.ReviewId == command.ReviewId)
            .ToListAsync(cancellationToken);
        dbContext.ReviewReplies.RemoveRange(replies);

        dbContext.Reviews.Remove(review);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} deleted successfully", command.ReviewId);
        return Result.Success();
    }
}
