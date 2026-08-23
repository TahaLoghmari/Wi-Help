using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Ports;

namespace Modules.Messaging.Features.MarkMessagesAsRead;

public class MarkMessagesAsReadCommandHandler(
    IMarkMessagesAsReadStore messageStore,
    IMessagingRealtimeEvents realtimeEvents,
    ILogger<MarkMessagesAsReadCommandHandler> logger) : ICommandHandler<MarkMessagesAsReadCommand>
{
    public async Task<Result> Handle(MarkMessagesAsReadCommand command, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await messageStore.GetConversationAsync(command.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", command.ConversationId);
            return Result.Failure(MessagingErrors.ConversationNotFound(command.ConversationId));
        }

        if (!conversation.IsParticipant(command.UserId))
        {
            logger.LogWarning("User {UserId} is not a participant in conversation {ConversationId}",
                command.UserId, command.ConversationId);
            return Result.Failure(MessagingErrors.NotParticipant());
        }

        var unreadMessages = await messageStore.GetUnreadMessagesAsync(
            command.ConversationId,
            command.UserId,
            cancellationToken);

        foreach (var message in unreadMessages)
        {
            message.MarkAsRead();
        }

        if (unreadMessages.Count > 0)
        {
            await messageStore.SaveAsync(cancellationToken);
            logger.LogInformation("Marked {Count} messages as read in conversation {ConversationId} by user {UserId}",
                unreadMessages.Count, command.ConversationId, command.UserId);

            // Notify sender that messages were read
            try
            {
                var senderIds = unreadMessages.Select(m => m.SenderId).Distinct().ToList();
                foreach (var senderId in senderIds)
                {
                    await realtimeEvents.MessagesReadAsync(
                        senderId,
                        command.ConversationId,
                        command.UserId,
                        cancellationToken);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send SignalR notification for messages read in conversation {ConversationId}", 
                    command.ConversationId);
                // Don't fail the operation - messages were marked as read successfully
            }
        }

        return Result.Success();
    }
}
