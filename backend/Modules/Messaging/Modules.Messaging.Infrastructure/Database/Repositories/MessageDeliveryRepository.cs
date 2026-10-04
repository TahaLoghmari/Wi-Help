using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Infrastructure.Database.Repositories;

public sealed class MessageDeliveryRepository(MessagingDbContext messagingDbContext) : IMessageDeliveryRepository
{
    public Task<List<Message>> GetPendingForOnlineUsersAsync(IReadOnlyCollection<Guid> onlineUserIds, CancellationToken cancellationToken)
    {
        var onlineUserIdList = onlineUserIds.ToList();
        return messagingDbContext.Messages.Include(m => m.Conversation)
            .Where(m => m.Status == MessageStatus.Sent && m.DeletedAt == null && onlineUserIdList.Contains(
                m.Conversation.Participant1Id == m.SenderId ? m.Conversation.Participant2Id : m.Conversation.Participant1Id))
            .ToListAsync(cancellationToken);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => messagingDbContext.SaveChangesAsync(cancellationToken);
}
