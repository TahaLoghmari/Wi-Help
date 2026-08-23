using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Abstractions;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Features.DeleteReview;

internal sealed class DeleteReviewCommandHandler(
    IDeleteReviewPort reviews,
    ILogger<DeleteReviewCommandHandler> logger) : ICommandHandler<DeleteReviewCommand>
{
    public async Task<Result> Handle(DeleteReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting review {ReviewId}", command.ReviewId);

        var review = await reviews.GetAsync(command.ReviewId, cancellationToken);

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

        await reviews.DeleteAsync(review, cancellationToken);

        logger.LogInformation("Review {ReviewId} deleted successfully", command.ReviewId);
        return Result.Success();
    }
}
