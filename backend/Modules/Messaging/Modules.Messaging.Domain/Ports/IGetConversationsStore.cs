using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public sealed record ConversationSummary(Conversation Conversation, Message? LastMessage, int UnreadCount);

public interface IGetConversationsStore
{
    Task<IReadOnlyList<ConversationSummary>> GetForUserAsync(Guid userId, CancellationToken cancellationToken);
}
