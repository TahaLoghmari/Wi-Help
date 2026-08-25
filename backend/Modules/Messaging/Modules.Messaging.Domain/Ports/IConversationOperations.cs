using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Ports;

public sealed record MessagePage(IReadOnlyList<Message> Messages, int TotalCount);
public sealed record ConversationSummary(Conversation Conversation, Message? LastMessage, int UnreadCount);

public interface IConversationOperations
{
    Task<Conversation?> FindAsync(Guid participant1Id, Guid participant2Id, CancellationToken cancellationToken);
    Task CreateAsync(Conversation conversation, CancellationToken cancellationToken);
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    Task SaveMessageAsync(Conversation conversation, Message message, CancellationToken cancellationToken);
    Task<List<Message>> GetSentMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<List<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<Message?> GetMessageAsync(Guid messageId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<MessagePage> GetPageAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<IReadOnlyList<ConversationSummary>> GetForUserAsync(Guid userId, CancellationToken cancellationToken);
}
