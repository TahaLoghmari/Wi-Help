using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Infrastructure.Services;

/// <summary>
/// Implementation of conversation access service for authorization checks.
/// </summary>
public class ConversationAccessService : IConversationAccessService
{
    private readonly MessagingDbContext _messagingDbContext;

    public ConversationAccessService(MessagingDbContext messagingDbContext)
    {
        _messagingDbContext = messagingDbContext;
    }

    public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId)
    {
        var conversation = await _messagingDbContext.Conversations
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == conversationId);

        return conversation?.IsParticipant(userId) ?? false;
    }
}
