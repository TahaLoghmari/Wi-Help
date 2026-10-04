using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.Domain.Services;

namespace Modules.Messaging.Infrastructure.Services;

public class ConversationAccessService(IConversationRepository conversationRepository) : IConversationAccessService
{
    public Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId) =>
        conversationRepository.IsParticipantAsync(conversationId, userId, CancellationToken.None);
}
