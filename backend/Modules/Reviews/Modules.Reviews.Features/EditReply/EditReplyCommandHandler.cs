using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.EditReply;

internal sealed class EditReplyCommandHandler(
    ReviewsDbContext dbContext,
    ILogger<EditReplyCommandHandler> logger) : ICommandHandler<EditReplyCommand>
{
    public async Task<Result> Handle(EditReplyCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Editing reply {ReplyId} on review {ReviewId}", command.ReplyId, command.ReviewId);

        var reply = await dbContext.ReviewReplies
            .FirstOrDefaultAsync(
                r => r.Id == command.ReplyId && r.ReviewId == command.ReviewId,
                cancellationToken);

        if (reply is null)
            return Result.Failure(ReviewErrors.ReplyNotFound(command.ReplyId));

        if (!command.IsAdmin && reply.UserId != command.CallerUserId)
            return Result.Failure(ReviewErrors.NotReplyOwner(command.ReplyId));

        reply.Update(command.Comment);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Reply {ReplyId} updated successfully", command.ReplyId);
        return Result.Success();
    }
}
