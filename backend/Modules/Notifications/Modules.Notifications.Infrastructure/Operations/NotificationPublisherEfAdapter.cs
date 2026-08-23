using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Domain.Operations;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Infrastructure.Operations;

public sealed class NotificationPublisherEfAdapter(NotificationsDbContext dbContext) : INotificationPublisher
{
    public async Task PublishAsync(Notification notification, CancellationToken cancellationToken)
    {
        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
