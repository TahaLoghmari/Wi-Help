using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class AddNotificationEfAdapter(NotificationsDbContext dbContext) : IAddNotification
{
    public async Task AddAsync(Notification notification, CancellationToken cancellationToken)
    {
        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
