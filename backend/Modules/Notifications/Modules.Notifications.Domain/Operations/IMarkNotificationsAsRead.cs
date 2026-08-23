namespace Modules.Notifications.Domain.Operations;

public interface IMarkNotificationsAsRead
{
    Task<bool> MarkAllAsync(string userId, CancellationToken cancellationToken);
}
