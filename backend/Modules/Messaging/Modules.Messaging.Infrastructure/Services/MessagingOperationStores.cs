using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Infrastructure.Services;

public sealed class CreateConversationStore(MessagingDbContext messagingDbContext) : ICreateConversationStore
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
}

public sealed class SendMessageStore(MessagingDbContext messagingDbContext) : ISendMessageStore
{
    public Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

    public async Task SaveAsync(Conversation conversation, Message message, CancellationToken cancellationToken)
    {
        messagingDbContext.Messages.Add(message);
        conversation.UpdateLastMessageAt();
        await messagingDbContext.SaveChangesAsync(cancellationToken);
    }
}

public sealed class MarkMessagesAsDeliveredStore(MessagingDbContext messagingDbContext) : IMarkMessagesAsDeliveredStore
{
    public Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

    public Task<List<Message>> GetSentMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.Where(m =>
            m.ConversationId == conversationId &&
            m.SenderId != userId &&
            m.Status == MessageStatus.Sent)
            .ToListAsync(cancellationToken);

    public Task SaveAsync(CancellationToken cancellationToken) => messagingDbContext.SaveChangesAsync(cancellationToken);
}

public sealed class MarkMessagesAsReadStore(MessagingDbContext messagingDbContext) : IMarkMessagesAsReadStore
{
    public Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

    public Task<List<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.Where(m =>
            m.ConversationId == conversationId &&
            m.SenderId != userId &&
            m.Status != MessageStatus.Read)
            .ToListAsync(cancellationToken);

    public Task SaveAsync(CancellationToken cancellationToken) => messagingDbContext.SaveChangesAsync(cancellationToken);
}

public sealed class DeleteMessageStore(MessagingDbContext messagingDbContext) : IDeleteMessageStore
{
    public Task<Message?> GetMessageAsync(Guid messageId, CancellationToken cancellationToken) =>
        messagingDbContext.Messages.FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);

    public Task SaveAsync(CancellationToken cancellationToken) => messagingDbContext.SaveChangesAsync(cancellationToken);
}

public sealed class GetMessagesStore(MessagingDbContext messagingDbContext) : IGetMessagesStore
{
    public Task<Conversation?> GetConversationAsync(Guid conversationId, CancellationToken cancellationToken) =>
        messagingDbContext.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

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
}

public sealed class GetConversationsStore(MessagingDbContext messagingDbContext) : IGetConversationsStore
{
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

public sealed class MessageStatusUpdateStore(MessagingDbContext messagingDbContext) : IMessageStatusUpdateStore
{
    public async Task<DeliveredMessageBatch> DeliverForOnlineUsersAsync(
        IReadOnlyCollection<Guid> onlineUserIds,
        CancellationToken cancellationToken)
    {
        var onlineUserIdList = onlineUserIds.ToList();
        var messages = await messagingDbContext.Messages
            .Include(m => m.Conversation)
            .Where(m =>
                m.Status == MessageStatus.Sent &&
                m.DeletedAt == null &&
                onlineUserIdList.Contains(m.Conversation.Participant1Id == m.SenderId
                    ? m.Conversation.Participant2Id
                    : m.Conversation.Participant1Id))
            .ToListAsync(cancellationToken);

        if (messages.Count == 0)
        {
            return new DeliveredMessageBatch(0, Array.Empty<DeliveredMessageNotification>());
        }

        foreach (var message in messages)
        {
            message.MarkAsDelivered();
        }

        await messagingDbContext.SaveChangesAsync(cancellationToken);

        var notifications = messages
            .GroupBy(m => new { m.SenderId, m.ConversationId })
            .Select(g => new DeliveredMessageNotification(
                g.Key.SenderId,
                g.Key.ConversationId,
                g.First().Conversation.GetOtherParticipant(g.Key.SenderId)))
            .ToList();

        return new DeliveredMessageBatch(messages.Count, notifications);
    }
}
