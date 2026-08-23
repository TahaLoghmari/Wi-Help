using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Abstractions;
using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Features.ReplyToReview;

internal sealed class ReplyToReviewCommandHandler(
    IReplyToReviewPort reviews,
    ILogger<ReplyToReviewCommandHandler> logger) : ICommandHandler<ReplyToReviewCommand>
{
    public async Task<Result> Handle(ReplyToReviewCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Replying to review {ReviewId} by user {UserId}",
            command.ReviewId, command.CallerUserId);

        var review = await reviews.GetReviewAsync(command.ReviewId, cancellationToken);

        if (review is null)
            return Result.Failure(ReviewErrors.NotFound(command.ReviewId));

        // Only review author or subject may reply
        bool isAuthorOrSubject =
            (command.CallerPatientId.HasValue && review.PatientId == command.CallerPatientId.Value)
            || (command.CallerProfessionalId.HasValue && review.ProfessionalId == command.CallerProfessionalId.Value);

        if (!isAuthorOrSubject)
            return Result.Failure(ReviewErrors.NotAuthorOrSubject(command.ReviewId));

        var reply = new ReviewReply(command.ReviewId, command.CallerUserId, command.Comment);

        await reviews.AddReplyAsync(reply, cancellationToken);

        logger.LogInformation("Reply added to review {ReviewId} by user {UserId}",
            command.ReviewId, command.CallerUserId);

        return Result.Success();
    }
}
