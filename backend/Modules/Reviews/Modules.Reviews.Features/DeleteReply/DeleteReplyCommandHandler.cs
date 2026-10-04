using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Repositories;

namespace Modules.Reviews.Features.DeleteReply;

internal sealed class DeleteReplyCommandHandler(
    IReviewRepository reviews,
    ILogger<DeleteReplyCommandHandler> logger) : ICommandHandler<DeleteReplyCommand>
{
    public async Task<Result> Handle(DeleteReplyCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting reply {ReplyId} on review {ReviewId}", command.ReplyId, command.ReviewId);

        var reply = await reviews.GetReplyAsync(command.ReviewId, command.ReplyId, cancellationToken);

        if (reply is null)
            return Result.Failure(ReviewErrors.ReplyNotFound(command.ReplyId));

        if (!command.IsAdmin && reply.UserId != command.CallerUserId)
            return Result.Failure(ReviewErrors.NotReplyOwner(command.ReplyId));

        reviews.RemoveReply(reply);
        await reviews.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Reply {ReplyId} deleted successfully", command.ReplyId);
        return Result.Success();
    }
}
