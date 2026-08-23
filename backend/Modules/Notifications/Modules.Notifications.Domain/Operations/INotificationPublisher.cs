using Modules.Notifications.Domain.Entities;

namespace Modules.Notifications.Domain.Operations;

public interface INotificationPublisher
{
    Task PublishAsync(Notification notification, CancellationToken cancellationToken);
}
