using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Repositories;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Database.Repositories;

public sealed class NotificationRepository(NotificationsDbContext dbContext) : INotificationRepository
{
    public async Task<NotificationPage> GetAsync(string userId, int page, int pageSize, CancellationToken cancellationToken)
    {
        IQueryable<NotificationListItem> notificationsQuery = dbContext.Notifications.AsNoTracking()
            .Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.CreatedAt)
            .Select(notification => new NotificationListItem(notification.Id, notification.Title, notification.Message,
                notification.Type, notification.IsRead, notification.CreatedAt));
        int totalCount = await notificationsQuery.CountAsync(cancellationToken);
        List<NotificationListItem> notifications = await notificationsQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new NotificationPage(notifications, totalCount);
    }

    public Task<Notification?> GetByIdAsync(Guid notificationId, string userId, CancellationToken cancellationToken) =>
        dbContext.Notifications.FirstOrDefaultAsync(
            notification => notification.Id == notificationId && notification.UserId == userId, cancellationToken);

    public async Task<IReadOnlyList<Notification>> GetUnreadAsync(string userId, CancellationToken cancellationToken) =>
        await dbContext.Notifications
            .Where(notification => notification.UserId == userId && !notification.IsRead).ToListAsync(cancellationToken);

    public void Add(Notification notification) => dbContext.Notifications.Add(notification);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
