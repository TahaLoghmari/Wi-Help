using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Ports;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Identity.PublicApi;

namespace Modules.Messaging.Features.SendMessage;

public class SendMessageCommandHandler(
    IConversationOperations conversationOperations,
    IMessagingRealtimeEvents realtimeEvents,
    INotificationsModuleApi notificationsModuleApi,
    IIdentityModuleApi identityModuleApi,
    ILogger<SendMessageCommandHandler> logger) : ICommandHandler<SendMessageCommand, Guid>
{
    public async Task<Result<Guid>> Handle(SendMessageCommand command, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await conversationOperations.GetConversationAsync(command.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", command.ConversationId);
            return Result<Guid>.Failure(MessagingErrors.ConversationNotFound(command.ConversationId));
        }

        if (!conversation.IsParticipant(command.SenderId))
        {
            logger.LogWarning("User {SenderId} is not a participant in conversation {ConversationId}",
                command.SenderId, command.ConversationId);
            return Result<Guid>.Failure(MessagingErrors.NotParticipant());
        }

        var message = new Message(
            command.ConversationId,
            command.SenderId,
            command.Content);

        await conversationOperations.SaveMessageAsync(conversation, message, cancellationToken);

        logger.LogInformation("Message {MessageId} sent in conversation {ConversationId} by user {SenderId}",
            message.Id, command.ConversationId, command.SenderId);

        // Get recipient ID
        var recipientId = conversation.GetOtherParticipant(command.SenderId);

        // Send notification to recipient
        try
        {
            // Get sender information for the notification
            var senderResult = await identityModuleApi.GetUserByIdAsync(command.SenderId, cancellationToken);
            var senderName = "Someone";
            if (senderResult.IsSuccess)
            {
                senderName = $"{senderResult.Value.FirstName} {senderResult.Value.LastName}";
            }

            await notificationsModuleApi.AddNotificationAsync(
                recipientId.ToString(),
                "User", // Will be filtered by the actual user's role
                "New Message",
                $"{senderName} sent you a message.",
                NotificationType.newMessage,
                CancellationToken.None);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to create notification for message {MessageId}", message.Id);
            // Don't fail the operation - message was saved successfully
        }

        // Notify all participants in the conversation via SignalR
        try
        {
            await realtimeEvents.MessageReceivedAsync(message, cancellationToken);

            // Also notify the recipient's personal group
            await realtimeEvents.NewMessageNotificationAsync(
                recipientId,
                conversation.Id,
                command.SenderId,
                command.Content.Length > 50 ? command.Content.Substring(0, 50) + "..." : command.Content,
                cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to send SignalR notification for message {MessageId}", message.Id);
            // Don't fail the operation - message was saved successfully
        }

        return Result<Guid>.Success(message.Id);
    }
}
