using Hangfire;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.Domain.Services;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure.Jobs;

public class MessageStatusUpdateJob(
    IMessageDeliveryRepository messageRepository,
    ConnectionTracker connectionTracker,
    IMessagingRealtimeEvents realtimeEvents,
    ILogger<MessageStatusUpdateJob> logger)
{
    [AutomaticRetry(Attempts = 3)]
    public async Task MarkMessagesAsDeliveredForOnlineUsers(CancellationToken cancellationToken = default)
    {
        var onlineUserIds = connectionTracker.GetOnlineUserIds().Select(Guid.Parse).ToList();
        if (onlineUserIds.Count == 0)
        {
            return;
        }

        var messages = await messageRepository.GetPendingForOnlineUsersAsync(onlineUserIds, cancellationToken);
        if (messages.Count == 0)
        {
            return;
        }

        foreach (var message in messages)
        {
            message.MarkAsDelivered();
        }
        await messageRepository.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Marked {Count} messages as delivered for online users", messages.Count);

        foreach (var notification in messages.GroupBy(m => new { m.SenderId, m.ConversationId }).Select(g => new
        {
            g.Key.SenderId,
            g.Key.ConversationId,
            DeliveredBy = g.First().Conversation.GetOtherParticipant(g.Key.SenderId)
        }))
        {
            try
            {
                await realtimeEvents.MessagesDeliveredAsync(
                    notification.SenderId,
                    notification.ConversationId,
                    notification.DeliveredBy,
                    cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex,
                    "Failed to send MessagesDelivered SignalR event to sender {SenderId} for conversation {ConversationId}",
                    notification.SenderId, notification.ConversationId);
            }
        }
    }
}
