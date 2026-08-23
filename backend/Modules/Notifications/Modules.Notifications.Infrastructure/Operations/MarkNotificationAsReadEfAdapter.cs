using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class MarkNotificationAsReadEfAdapter(NotificationsDbContext dbContext) : IMarkNotificationAsRead
{
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
}
