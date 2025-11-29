using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Notifications.Domain;
using Modules.Notifications.Infrastructure;

namespace Modules.Notifications.Infrastructure.Services;

public class NotificationsService(
    IHubContext<NotificationHub> hubContext,
    ILogger<NotificationsService> logger)
{
    public async Task SendToUser(string userId, NotificationDto notificationDto)
    {
        try
        {
            logger.LogInformation(
                "Sending notification to user {UserId}. NotificationId: {NotificationId}, Type: {Type}",
                userId, notificationDto.Id, notificationDto.Type);

            await hubContext.Clients.User(userId).SendAsync("NotificationReceived", notificationDto);

            logger.LogInformation(
                "Notification sent successfully to user {UserId}. NotificationId: {NotificationId}",
                userId, notificationDto.Id);
        }
        catch (Exception ex)
        {
            logger.LogError(ex,
                "Failed to send notification to user {UserId}. NotificationId: {NotificationId}",
                userId, notificationDto.Id);
            throw;
        }
    }
}