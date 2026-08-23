namespace Modules.Messaging.Domain.Ports;

public interface IConversationAccessService
{
    Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId);
}
