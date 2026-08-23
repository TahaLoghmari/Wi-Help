using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Ports;

namespace Modules.Messaging.Features.DeleteMessage;

public class DeleteMessageCommandHandler(
    IConversationOperations conversationOperations,
    IMessagingRealtimeEvents realtimeEvents,
    ILogger<DeleteMessageCommandHandler> logger) : ICommandHandler<DeleteMessageCommand>
{
    public async Task<Result> Handle(DeleteMessageCommand command, CancellationToken cancellationToken)
    {
        var message = await conversationOperations.GetMessageAsync(command.MessageId, cancellationToken);

        if (message == null)
        {
            logger.LogWarning("Message {MessageId} not found", command.MessageId);
            return Result.Failure(MessagingErrors.MessageNotFound(command.MessageId));
        }

        // Only the sender can delete their message
        if (message.SenderId != command.UserId)
        {
            logger.LogWarning("User {UserId} attempted to delete message {MessageId} they didn't send",
                command.UserId, command.MessageId);
            return Result.Failure(MessagingErrors.CannotDeleteMessage());
        }

        message.Delete();
        await conversationOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Message {MessageId} deleted by user {UserId}", command.MessageId, command.UserId);

        // Notify all participants in the conversation
        try
        {
            await realtimeEvents.MessageDeletedAsync(message.Id, message.ConversationId, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to send SignalR notification for message deletion {MessageId}", message.Id);
            // Don't fail the operation - message was deleted successfully
        }

        return Result.Success();
    }
}
