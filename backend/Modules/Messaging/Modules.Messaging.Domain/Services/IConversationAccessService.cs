namespace Modules.Messaging.Domain.Services;

public interface IConversationAccessService
{
    Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId);
}
