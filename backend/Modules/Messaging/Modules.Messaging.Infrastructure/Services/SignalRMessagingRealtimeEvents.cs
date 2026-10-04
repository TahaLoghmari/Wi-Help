using Microsoft.AspNetCore.SignalR;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Services;

namespace Modules.Messaging.Infrastructure.Services;

public class SignalRMessagingRealtimeEvents(IHubContext<ChatHub> hubContext) : IMessagingRealtimeEvents
{
    public Task MessageReceivedAsync(Message message, CancellationToken cancellationToken) =>
        hubContext.Clients.Group($"conversation_{message.ConversationId}")
            .SendAsync("MessageReceived", new
            {
                MessageId = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                Status = message.Status.ToString(),
                CreatedAt = message.CreatedAt
            }, cancellationToken);

    public Task NewMessageNotificationAsync(
        Guid recipientId,
        Guid conversationId,
        Guid senderId,
        string preview,
        CancellationToken cancellationToken) =>
        hubContext.Clients.Group($"user_{recipientId}")
            .SendAsync("NewMessageNotification", new
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Preview = preview
            }, cancellationToken);

    public Task MessagesReadAsync(Guid senderId, Guid conversationId, Guid readBy, CancellationToken cancellationToken) =>
        hubContext.Clients.Group($"user_{senderId}")
            .SendAsync("MessagesRead", new
            {
                ConversationId = conversationId,
                ReadBy = readBy
            }, cancellationToken);

    public Task MessagesDeliveredAsync(Guid senderId, Guid conversationId, Guid deliveredBy, CancellationToken cancellationToken) =>
        hubContext.Clients.Group($"user_{senderId}")
            .SendAsync("MessagesDelivered", new
            {
                ConversationId = conversationId,
                DeliveredBy = deliveredBy
            }, cancellationToken);

    public Task MessageDeletedAsync(Guid messageId, Guid conversationId, CancellationToken cancellationToken) =>
        hubContext.Clients.Group($"conversation_{conversationId}")
            .SendAsync("MessageDeleted", new
            {
                MessageId = messageId,
                ConversationId = conversationId
            }, cancellationToken);
}
