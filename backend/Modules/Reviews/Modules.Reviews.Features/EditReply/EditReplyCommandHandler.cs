using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Repositories;

namespace Modules.Reviews.Features.EditReply;

internal sealed class EditReplyCommandHandler(
    IReviewRepository reviews,
    ILogger<EditReplyCommandHandler> logger) : ICommandHandler<EditReplyCommand>
{
    public async Task<Result> Handle(EditReplyCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Editing reply {ReplyId} on review {ReviewId}", command.ReplyId, command.ReviewId);

        var reply = await reviews.GetReplyAsync(command.ReviewId, command.ReplyId, cancellationToken);

        if (reply is null)
            return Result.Failure(ReviewErrors.ReplyNotFound(command.ReplyId));

        if (!command.IsAdmin && reply.UserId != command.CallerUserId)
            return Result.Failure(ReviewErrors.NotReplyOwner(command.ReplyId));

        reply.Update(command.Comment);
        await reviews.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Reply {ReplyId} updated successfully", command.ReplyId);
        return Result.Success();
    }
}
