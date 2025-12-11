using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.MarkMessagesAsDelivered;

public class MarkMessagesAsDeliveredCommandHandler(
    MessagingDbContext messagingDbContext,
    IHubContext<ChatHub> hubContext,
    ILogger<MarkMessagesAsDeliveredCommandHandler> logger) : ICommandHandler<MarkMessagesAsDeliveredCommand>
{
    public async Task<Result> Handle(MarkMessagesAsDeliveredCommand command, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == command.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", command.ConversationId);
            return Result.Failure(MessagingErrors.ConversationNotFound(command.ConversationId));
        }

        if (!conversation.IsParticipant(command.UserId))
        {
            logger.LogWarning("User {UserId} is not a participant in conversation {ConversationId}",
                command.UserId, command.ConversationId);
            return Result.Failure(MessagingErrors.NotParticipant());
        }

        // Mark all sent messages from other participants as delivered
        // DeletedAt filter is handled by global query filter in MessagingDbContext
        var sentMessages = await messagingDbContext.Messages
            .Where(m =>
                m.ConversationId == command.ConversationId &&
                m.SenderId != command.UserId &&
                m.Status == MessageStatus.Sent)
            .ToListAsync(cancellationToken);

        foreach (var message in sentMessages)
        {
            message.MarkAsDelivered();
        }

        if (sentMessages.Count > 0)
        {
            await messagingDbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Marked {Count} messages as delivered in conversation {ConversationId} by user {UserId}",
                sentMessages.Count, command.ConversationId, command.UserId);

            // Notify sender that messages were delivered
            try
            {
                var senderIds = sentMessages.Select(m => m.SenderId).Distinct().ToList();
                foreach (var senderId in senderIds)
                {
                    await hubContext.Clients.Group($"user_{senderId}")
                        .SendAsync("MessagesDelivered", new
                        {
                            ConversationId = command.ConversationId,
                            DeliveredBy = command.UserId
                        }, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send SignalR notification for messages delivered in conversation {ConversationId}", 
                    command.ConversationId);
                // Don't fail the operation - messages were marked as delivered successfully
            }
        }

        return Result.Success();
    }
}

