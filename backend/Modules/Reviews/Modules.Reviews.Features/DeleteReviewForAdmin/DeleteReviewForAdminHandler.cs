using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.DeleteReviewForAdmin;

public class DeleteReviewForAdminHandler(
    ReviewsDbContext reviewsDbContext,
    ILogger<DeleteReviewForAdminHandler> logger) : ICommandHandler<DeleteReviewForAdminCommand>
{
    public async Task<Result> Handle(DeleteReviewForAdminCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Admin deleting review {ReviewId}", command.ReviewId);

        var review = await reviewsDbContext.Reviews
            .FirstOrDefaultAsync(r => r.Id == command.ReviewId, cancellationToken);

        if (review is null)
        {
            return Result.Failure(ReviewErrors.ReviewNotFound(command.ReviewId));
        }

        reviewsDbContext.Reviews.Remove(review);
        await reviewsDbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
