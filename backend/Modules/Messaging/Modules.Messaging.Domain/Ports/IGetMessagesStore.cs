using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public sealed record MessagePage(IReadOnlyList<Message> Messages, int TotalCount);

public interface IGetMessagesStore
{
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    Task<MessagePage> GetPageAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken);
}
