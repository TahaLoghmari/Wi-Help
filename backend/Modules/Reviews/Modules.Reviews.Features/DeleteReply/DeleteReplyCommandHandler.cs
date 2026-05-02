using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.DeleteReply;

internal sealed class DeleteReplyCommandHandler(
    ReviewsDbContext dbContext,
    ILogger<DeleteReplyCommandHandler> logger) : ICommandHandler<DeleteReplyCommand>
{
    public async Task<Result> Handle(DeleteReplyCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting reply {ReplyId} on review {ReviewId}", command.ReplyId, command.ReviewId);

        var reply = await dbContext.ReviewReplies
            .FirstOrDefaultAsync(
                r => r.Id == command.ReplyId && r.ReviewId == command.ReviewId,
                cancellationToken);

        if (reply is null)
            return Result.Failure(ReviewErrors.ReplyNotFound(command.ReplyId));

        if (!command.IsAdmin && reply.UserId != command.CallerUserId)
            return Result.Failure(ReviewErrors.NotReplyOwner(command.ReplyId));

        dbContext.ReviewReplies.Remove(reply);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Reply {ReplyId} deleted successfully", command.ReplyId);
        return Result.Success();
    }
}
