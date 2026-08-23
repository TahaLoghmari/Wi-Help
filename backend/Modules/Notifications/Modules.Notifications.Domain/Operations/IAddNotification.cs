using Modules.Notifications.Domain.Entities;

namespace Modules.Notifications.Domain.Operations;

public interface IAddNotification
{
    Task AddAsync(Notification notification, CancellationToken cancellationToken);
}
