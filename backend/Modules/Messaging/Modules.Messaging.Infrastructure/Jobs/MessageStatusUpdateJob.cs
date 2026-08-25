using Hangfire;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure.Jobs;

public class MessageStatusUpdateJob(
    IMessageStatusUpdateStore messageStore,
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

        var deliveredMessages = await messageStore.DeliverForOnlineUsersAsync(onlineUserIds, cancellationToken);
        if (deliveredMessages.Count == 0)
        {
            return;
        }

        logger.LogInformation("Marked {Count} messages as delivered for online users", deliveredMessages.Count);

        foreach (var notification in deliveredMessages.Notifications)
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
