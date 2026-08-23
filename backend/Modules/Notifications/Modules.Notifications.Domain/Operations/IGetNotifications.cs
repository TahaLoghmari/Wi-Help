namespace Modules.Notifications.Domain.Operations;

public interface IGetNotifications
{
    Task<NotificationPage> GetAsync(string userId, int page, int pageSize, CancellationToken cancellationToken);
}

public sealed record NotificationPage(IReadOnlyList<NotificationListItem> Items, int TotalCount);

public sealed record NotificationListItem(
    Guid Id,
    string Title,
    string Message,
    Enums.NotificationType Type,
    bool IsRead,
    DateTime CreatedAt);
