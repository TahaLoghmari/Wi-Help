using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.EditReview;

internal sealed class EditReviewCommandHandler(
    ReviewsDbContext dbContext,
    ILogger<EditReviewCommandHandler> logger) : ICommandHandler<EditReviewCommand>
{
    public async Task<Result> Handle(EditReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Editing review {ReviewId}", command.ReviewId);

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

        review.Update(command.Comment, command.Rating);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Review {ReviewId} updated successfully", command.ReviewId);
        return Result.Success();
    }
}
