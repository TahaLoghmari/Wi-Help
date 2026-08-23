using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class NotificationInboxEfAdapter(NotificationsDbContext dbContext) : INotificationInbox
{
    public async Task<NotificationPage> GetAsync(
        string userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        IQueryable<NotificationListItem> notificationsQuery = dbContext.Notifications
            .AsNoTracking()
            .Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.CreatedAt)
            .Select(notification => new NotificationListItem(
                notification.Id,
                notification.Title,
                notification.Message,
                notification.Type,
                notification.IsRead,
                notification.CreatedAt));

        int totalCount = await notificationsQuery.CountAsync(cancellationToken);
        List<NotificationListItem> notifications = await notificationsQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new NotificationPage(notifications, totalCount);
    }

    public async Task<bool> MarkAsync(Guid notificationId, string userId, CancellationToken cancellationToken)
    {
        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(
                notification => notification.Id == notificationId && notification.UserId == userId,
                cancellationToken);

        if (notification is null)
        {
            return false;
        }

        if (!notification.IsRead)
        {
            notification.MarkAsRead();
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return true;
    }

    public async Task<bool> MarkAllAsync(string userId, CancellationToken cancellationToken)
    {
        var notifications = await dbContext.Notifications
            .Where(notification => notification.UserId == userId && !notification.IsRead)
            .ToListAsync(cancellationToken);

        if (notifications.Count == 0)
        {
            return false;
        }

        foreach (var notification in notifications)
        {
            notification.MarkAsRead();
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}
