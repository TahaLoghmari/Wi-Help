namespace Modules.Notifications.Domain.Services;

public interface INotificationDelivery
{
    Task SendToUserAsync(string userId, NotificationDto notification);
}
