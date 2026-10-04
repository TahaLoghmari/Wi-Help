using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Domain.Services;

public interface IMessagingRealtimeEvents
{
    Task MessageReceivedAsync(Message message, CancellationToken cancellationToken);
    Task NewMessageNotificationAsync(Guid recipientId, Guid conversationId, Guid senderId, string preview, CancellationToken cancellationToken);
    Task MessagesReadAsync(Guid senderId, Guid conversationId, Guid readBy, CancellationToken cancellationToken);
    Task MessagesDeliveredAsync(Guid senderId, Guid conversationId, Guid deliveredBy, CancellationToken cancellationToken);
    Task MessageDeletedAsync(Guid messageId, Guid conversationId, CancellationToken cancellationToken);
}
