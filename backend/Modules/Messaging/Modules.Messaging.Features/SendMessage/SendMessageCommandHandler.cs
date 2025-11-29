using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.SendMessage;

public class SendMessageCommandHandler(
    MessagingDbContext messagingDbContext,
    IHubContext<ChatHub> hubContext,
    ILogger<SendMessageCommandHandler> logger) : ICommandHandler<SendMessageCommand, Guid>
{
    public async Task<Result<Guid>> Handle(SendMessageCommand command, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == command.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", command.ConversationId);
            return Result<Guid>.Failure(Error.NotFound("Messaging.ConversationNotFound", $"Conversation with ID '{command.ConversationId}' not found."));
        }

        if (!conversation.IsParticipant(command.SenderId))
        {
            logger.LogWarning("User {SenderId} is not a participant in conversation {ConversationId}",
                command.SenderId, command.ConversationId);
            return Result<Guid>.Failure(Error.Forbidden("Messaging.NotParticipant", "You are not a participant in this conversation."));
        }

        var message = new Message(
            command.ConversationId,
            command.SenderId,
            command.Content);

        messagingDbContext.Messages.Add(message);
        conversation.UpdateLastMessageAt();
        await messagingDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Message {MessageId} sent in conversation {ConversationId} by user {SenderId}",
            message.Id, command.ConversationId, command.SenderId);

        // Notify all participants in the conversation via SignalR
        var recipientId = conversation.GetOtherParticipant(command.SenderId);
        await hubContext.Clients.Group($"conversation_{command.ConversationId}")
            .SendAsync("MessageReceived", new
            {
                MessageId = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                Status = message.Status.ToString(),
                CreatedAt = message.CreatedAt
            }, cancellationToken);

        // Also notify the recipient's personal group
        await hubContext.Clients.Group($"user_{recipientId}")
            .SendAsync("NewMessageNotification", new
            {
                ConversationId = conversation.Id,
                SenderId = command.SenderId,
                Preview = command.Content.Length > 50 ? command.Content.Substring(0, 50) + "..." : command.Content
            }, cancellationToken);

        return Result<Guid>.Success(message.Id);
    }
}

