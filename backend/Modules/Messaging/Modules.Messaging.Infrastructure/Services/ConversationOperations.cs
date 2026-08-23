using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Infrastructure.Services;

public sealed class ConversationOperations(MessagingDbContext messagingDbContext) : IConversationOperations
{
    public Task<Conversation?> FindAsync(Guid participant1Id, Guid participant2Id, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c =>
            (c.Participant1Id == participant1Id && c.Participant2Id == participant2Id) ||
            (c.Participant1Id == participant2Id && c.Participant2Id == participant1Id),
            cancellationToken);

    public async Task CreateAsync(Conversation conversation, CancellationToken cancellationToken)
    {
        messagingDbContext.Conversations.Add(conversation);
        await messagingDbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

    public async Task SaveMessageAsync(Conversation conversation, Message message, CancellationToken cancellationToken)
    {
        messagingDbContext.Messages.Add(message);
        conversation.UpdateLastMessageAt();
        await messagingDbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<List<Message>> GetSentMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.Where(m =>
            m.ConversationId == conversationId &&
            m.SenderId != userId &&
            m.Status == MessageStatus.Sent)
            .ToListAsync(cancellationToken);

    public Task<List<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.Where(m =>
            m.ConversationId == conversationId &&
            m.SenderId != userId &&
            m.Status != MessageStatus.Read)
            .ToListAsync(cancellationToken);

    public Task<Message?> GetMessageAsync(Guid messageId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => messagingDbContext.SaveChangesAsync(cancellationToken);

    public async Task<MessagePage> GetPageAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await messagingDbContext.Messages.CountAsync(m => m.ConversationId == conversationId, cancellationToken);
        var messages = await messagingDbContext.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new MessagePage(messages, totalCount);
    }

    public async Task<IReadOnlyList<ConversationSummary>> GetForUserAsync(Guid userId, CancellationToken cancellationToken) =>
        await messagingDbContext.Conversations
            .Where(c => c.Participant1Id == userId || c.Participant2Id == userId)
            .Select(c => new ConversationSummary(
                c,
                c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault(),
                c.Messages.Count(m => m.SenderId != userId && m.Status != MessageStatus.Read)))
            .OrderByDescending(x => x.Conversation.LastMessageAt ?? x.Conversation.CreatedAt)
            .ToListAsync(cancellationToken);
}
