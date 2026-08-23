using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Ports;

namespace Modules.Messaging.Features.MarkMessagesAsDelivered;

public class MarkMessagesAsDeliveredCommandHandler(
    IMarkMessagesAsDeliveredStore messageStore,
    IMessagingRealtimeEvents realtimeEvents,
    ILogger<MarkMessagesAsDeliveredCommandHandler> logger) : ICommandHandler<MarkMessagesAsDeliveredCommand>
{
    public async Task<Result> Handle(MarkMessagesAsDeliveredCommand command, CancellationToken cancellationToken)
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

        var sentMessages = await messageStore.GetSentMessagesAsync(
            command.ConversationId,
            command.UserId,
            cancellationToken);

        foreach (var message in sentMessages)
        {
            message.MarkAsDelivered();
        }

        if (sentMessages.Count > 0)
        {
            await messageStore.SaveAsync(cancellationToken);
            logger.LogInformation("Marked {Count} messages as delivered in conversation {ConversationId} by user {UserId}",
                sentMessages.Count, command.ConversationId, command.UserId);

            // Notify sender that messages were delivered
            try
            {
                var senderIds = sentMessages.Select(m => m.SenderId).Distinct().ToList();
                foreach (var senderId in senderIds)
                {
                    await realtimeEvents.MessagesDeliveredAsync(
                        senderId,
                        command.ConversationId,
                        command.UserId,
                        cancellationToken);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send SignalR notification for messages delivered in conversation {ConversationId}", 
                    command.ConversationId);
                // Don't fail the operation - messages were marked as delivered successfully
            }
        }

        return Result.Success();
    }
}
