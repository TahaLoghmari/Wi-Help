using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Services;

public class NotificationsService(
    NotificationsDbContext dbContext,
    IHubContext<NotificationHub> hubContext,
    ILogger<NotificationsService> logger)
{
    public async Task AddNotificationAsync(
        string userId,
        string title,
        string message,
        NotificationType type,
        CancellationToken cancellationToken)
    {
        var notification = new Notification(userId, title, message, type);

        dbContext.Notifications.Add(notification);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Notification created with ID {NotificationId}", notification.Id);

        var dto = new NotificationDto(
            notification.Id,
            notification.Title,
            notification.Message,
            notification.Type,
            notification.IsRead,
            notification.CreatedAt);

        await SendToUser(userId, dto);
    }

    private async Task SendToUser(string userId, NotificationDto notificationDto)
    {
        await hubContext.Clients.User(userId).SendAsync("NotificationReceived", notificationDto);
    }
}