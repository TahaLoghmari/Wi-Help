using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public interface ISendMessageStore
{
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    Task SaveAsync(Conversation conversation, Message message, CancellationToken cancellationToken);
}
