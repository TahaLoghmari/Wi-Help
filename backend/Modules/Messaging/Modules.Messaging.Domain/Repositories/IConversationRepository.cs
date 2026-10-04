using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Repositories;

public sealed record MessagePage(IReadOnlyList<Message> Messages, int TotalCount);
public sealed record ConversationSummary(Conversation Conversation, Message? LastMessage, int UnreadCount);

public interface IConversationRepository
{
    Task<Conversation?> FindAsync(Guid participant1Id, Guid participant2Id, CancellationToken cancellationToken);
    void Add(Conversation conversation);
    Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken);
    void AddMessage(Message message);
    Task<List<Message>> GetSentMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<List<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<Message?> GetMessageAsync(Guid messageId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<MessagePage> GetPageAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<IReadOnlyList<ConversationSummary>> GetForUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> IsParticipantAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
}
