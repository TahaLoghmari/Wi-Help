using Modules.Notifications.Domain.Entities;

namespace Modules.Notifications.Domain.Repositories;

public interface INotificationRepository
{
    Task<NotificationPage> GetAsync(string userId, int page, int pageSize, CancellationToken cancellationToken);
    Task<Notification?> GetByIdAsync(Guid notificationId, string userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Notification>> GetUnreadAsync(string userId, CancellationToken cancellationToken);
    void Add(Notification notification);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public sealed record NotificationPage(IReadOnlyList<NotificationListItem> Items, int TotalCount);

public sealed record NotificationListItem(
    Guid Id,
    string Title,
    string Message,
    Enums.NotificationType Type,
    bool IsRead,
    DateTime CreatedAt);
