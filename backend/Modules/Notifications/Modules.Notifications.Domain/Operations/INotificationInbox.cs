namespace Modules.Notifications.Domain.Operations;

public interface INotificationInbox
{
    Task<NotificationPage> GetAsync(string userId, int page, int pageSize, CancellationToken cancellationToken);
    Task<bool> MarkAsync(Guid notificationId, string userId, CancellationToken cancellationToken);
    Task<bool> MarkAllAsync(string userId, CancellationToken cancellationToken);
}

public sealed record NotificationPage(IReadOnlyList<NotificationListItem> Items, int TotalCount);

public sealed record NotificationListItem(
    Guid Id,
    string Title,
    string Message,
    Enums.NotificationType Type,
    bool IsRead,
    DateTime CreatedAt);
