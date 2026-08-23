namespace Modules.Messaging.Domain.Ports;

public sealed record DeliveredMessageNotification(Guid SenderId, Guid ConversationId, Guid DeliveredBy);
public sealed record DeliveredMessageBatch(int Count, IReadOnlyList<DeliveredMessageNotification> Notifications);

public interface IMessageStatusUpdateStore
{
    Task<DeliveredMessageBatch> DeliverForOnlineUsersAsync(
        IReadOnlyCollection<Guid> onlineUserIds,
        CancellationToken cancellationToken);
}
