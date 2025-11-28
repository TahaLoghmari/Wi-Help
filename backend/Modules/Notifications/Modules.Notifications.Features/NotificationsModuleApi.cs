using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.Infrastructure;
using Modules.Notifications.Infrastructure.Database;
using Modules.Notifications.Infrastructure.Services;
using Modules.Notifications.PublicApi;

namespace Modules.Notifications.Features;

public class NotificationsModuleApi(
    NotificationsDbContext dbContext,
    NotificationsService notificationsService,
    ILogger<NotificationsModuleApi> logger) : INotificationsModuleApi
{
    public async Task AddNotificationAsync(string userId, string title, string message, NotificationType type, CancellationToken cancellationToken)
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

        await notificationsService.SendToUser(userId, dto);
    }
}