using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public interface IMarkMessagesAsReadStore
{
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    Task<List<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task SaveAsync(CancellationToken cancellationToken);
}
