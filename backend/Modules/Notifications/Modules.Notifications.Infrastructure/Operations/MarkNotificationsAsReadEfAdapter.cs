using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class MarkNotificationsAsReadEfAdapter(NotificationsDbContext dbContext) : IMarkNotificationsAsRead
{
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
