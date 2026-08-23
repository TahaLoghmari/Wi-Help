namespace Modules.Notifications.Domain.Operations;

public interface INotificationDelivery
{
    Task SendToUserAsync(string userId, NotificationDto notification);
}
