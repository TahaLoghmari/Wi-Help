using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public interface IDeleteMessageStore
{
    Task<Message?> GetMessageAsync(Guid messageId, CancellationToken cancellationToken);
    Task SaveAsync(CancellationToken cancellationToken);
}
