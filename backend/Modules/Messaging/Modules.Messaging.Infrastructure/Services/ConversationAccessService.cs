using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Infrastructure.Services;

public class ConversationAccessService : IConversationAccessService
{
    private readonly MessagingDbContext _messagingDbContext;

    public ConversationAccessService(MessagingDbContext messagingDbContext)
    {
        _messagingDbContext = messagingDbContext;
    }

    public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId)
    {
        return await _messagingDbContext.Conversations
            .AsNoTracking()
            .AnyAsync(c => c.Id == conversationId &&
                           (c.Participant1Id == userId || c.Participant2Id == userId));
    }
}
