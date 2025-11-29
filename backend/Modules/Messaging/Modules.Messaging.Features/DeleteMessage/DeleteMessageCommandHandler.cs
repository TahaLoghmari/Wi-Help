using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.DeleteMessage;

public class DeleteMessageCommandHandler(
    MessagingDbContext messagingDbContext,
    IHubContext<ChatHub> hubContext,
    ILogger<DeleteMessageCommandHandler> logger) : ICommandHandler<DeleteMessageCommand>
{
    public async Task<Result> Handle(DeleteMessageCommand command, CancellationToken cancellationToken)
    {
        var message = await messagingDbContext.Messages
            .Include(m => m.Conversation)
            .FirstOrDefaultAsync(m => m.Id == command.MessageId, cancellationToken);

        if (message == null)
        {
            logger.LogWarning("Message {MessageId} not found", command.MessageId);
            return Result.Failure(Error.NotFound("Messaging.MessageNotFound", $"Message with ID '{command.MessageId}' not found."));
        }

        // Only the sender can delete their message
        if (message.SenderId != command.UserId)
        {
            logger.LogWarning("User {UserId} attempted to delete message {MessageId} they didn't send",
                command.UserId, command.MessageId);
            return Result.Failure(Error.Forbidden("Messaging.CannotDeleteMessage", "You can only delete your own messages."));
        }

        message.Delete();
        await messagingDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Message {MessageId} deleted by user {UserId}", command.MessageId, command.UserId);

        // Notify all participants in the conversation
        await hubContext.Clients.Group($"conversation_{message.ConversationId}")
            .SendAsync("MessageDeleted", new
            {
                MessageId = message.Id,
                ConversationId = message.ConversationId
            }, cancellationToken);

        return Result.Success();
    }
}

