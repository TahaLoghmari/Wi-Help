using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class GetNotificationsEfAdapter(NotificationsDbContext dbContext) : IGetNotifications
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
}
