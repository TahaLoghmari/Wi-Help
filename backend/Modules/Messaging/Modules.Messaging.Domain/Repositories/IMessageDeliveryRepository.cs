using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Repositories;

public interface IMessageDeliveryRepository
{
    Task<List<Message>> GetPendingForOnlineUsersAsync(
        IReadOnlyCollection<Guid> onlineUserIds,
        CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
