using Microsoft.Extensions.Logging;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;

namespace Modules.Notifications.Features;

public class NotificationsModuleApi(
    INotificationPublisher notificationPublisher,
    INotificationDelivery notificationDelivery,
    ILogger<NotificationsModuleApi> logger) : INotificationsModuleApi
{
    public async Task AddNotificationAsync(string userId, string role, string title, string message, NotificationType type, CancellationToken cancellationToken)
    {
        var notification = new Notification(userId, role, title, message, (Modules.Notifications.Domain.Enums.NotificationType)type);

        await notificationPublisher.PublishAsync(notification, cancellationToken);

        logger.LogInformation("Notification created with ID {NotificationId}", notification.Id);

        var dto = new NotificationDto(
            notification.Id,
            notification.Title,
            notification.Message,
            notification.Type,
            notification.Role,
            notification.IsRead,
            notification.CreatedAt);

        await notificationDelivery.SendToUserAsync(userId, dto);
    }
}
