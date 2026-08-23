using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public interface ICreateConversationStore
{
    Task<Conversation?> FindAsync(Guid participant1Id, Guid participant2Id, CancellationToken cancellationToken);
    Task CreateAsync(Conversation conversation, CancellationToken cancellationToken);
}
