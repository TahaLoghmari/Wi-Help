using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public interface IMarkMessagesAsDeliveredStore
{
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    Task<List<Message>> GetSentMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task SaveAsync(CancellationToken cancellationToken);
}
