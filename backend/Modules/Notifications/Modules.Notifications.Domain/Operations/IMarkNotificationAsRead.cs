namespace Modules.Notifications.Domain.Operations;

public interface IMarkNotificationAsRead
{
    Task<bool> MarkAsync(Guid notificationId, string userId, CancellationToken cancellationToken);
}
