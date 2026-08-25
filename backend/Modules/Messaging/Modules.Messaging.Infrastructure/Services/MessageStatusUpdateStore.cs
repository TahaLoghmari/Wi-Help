using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Infrastructure.Services;

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
