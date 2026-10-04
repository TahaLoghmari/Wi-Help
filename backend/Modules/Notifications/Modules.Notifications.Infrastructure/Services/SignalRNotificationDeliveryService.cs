using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Services;
using Modules.Notifications.Infrastructure;

namespace Modules.Notifications.Infrastructure.Services;

public class SignalRNotificationDeliveryService(
    IHubContext<NotificationHub> hubContext,
    ILogger<SignalRNotificationDeliveryService> logger) : INotificationDelivery
{
    public async Task SendToUserAsync(string userId, NotificationDto notificationDto)
    {
        try
        {
            logger.LogInformation("Sending notification to user {UserId}. NotificationId: {NotificationId}, Type: {Type}", userId, notificationDto.Id, notificationDto.Type);
            await hubContext.Clients.User(userId).SendAsync("NotificationReceived", notificationDto);
            logger.LogInformation("Notification sent successfully to user {UserId}. NotificationId: {NotificationId}", userId, notificationDto.Id);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to push real-time notification to user {UserId}. NotificationId: {NotificationId}. The notification is persisted and will be delivered on the next fetch.", userId, notificationDto.Id);
        }
    }
}
