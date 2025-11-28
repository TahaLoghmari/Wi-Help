using Modules.Notifications.Domain.Enums;

namespace Modules.Notifications.PublicApi;

public interface INotificationsModuleApi
{
    Task AddNotificationAsync(string userId, string role, string title, string message, NotificationType type, CancellationToken cancellationToken);
}