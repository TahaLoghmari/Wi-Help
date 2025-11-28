using Modules.Notifications.Domain.Enums;
using Modules.Notifications.Infrastructure.Services;
using Modules.Notifications.PublicApi;

namespace Modules.Notifications.Features;

public class NotificationsModuleApi(NotificationsService notificationsService) : INotificationsModuleApi
{
    public async Task AddNotificationAsync(string userId, string title, string message, NotificationType type, CancellationToken cancellationToken)
    {
        await notificationsService.AddNotificationAsync(userId, title, message, type, cancellationToken);
    }
}