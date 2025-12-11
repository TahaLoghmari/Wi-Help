using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.MarkMessagesAsRead;

public class MarkMessagesAsReadCommandHandler(
    MessagingDbContext messagingDbContext,
    IHubContext<ChatHub> hubContext,
    ILogger<MarkMessagesAsReadCommandHandler> logger) : ICommandHandler<MarkMessagesAsReadCommand>
{
    public async Task<Result> Handle(MarkMessagesAsReadCommand command, CancellationToken cancellationToken)
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

        // Mark all unread messages from other participants as read
        // DeletedAt filter is handled by global query filter in MessagingDbContext
        var unreadMessages = await messagingDbContext.Messages
            .Where(m =>
                m.ConversationId == command.ConversationId &&
                m.SenderId != command.UserId &&
                m.Status != MessageStatus.Read)
            .ToListAsync(cancellationToken);

        foreach (var message in unreadMessages)
        {
            message.MarkAsRead();
        }

        if (unreadMessages.Count > 0)
        {
            await messagingDbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Marked {Count} messages as read in conversation {ConversationId} by user {UserId}",
                unreadMessages.Count, command.ConversationId, command.UserId);

            // Notify sender that messages were read
            try
            {
                var senderIds = unreadMessages.Select(m => m.SenderId).Distinct().ToList();
                foreach (var senderId in senderIds)
                {
                    await hubContext.Clients.Group($"user_{senderId}")
                        .SendAsync("MessagesRead", new
                        {
                            ConversationId = command.ConversationId,
                            ReadBy = command.UserId
                        }, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send SignalR notification for messages read in conversation {ConversationId}", 
                    command.ConversationId);
                // Don't fail the operation - messages were marked as read successfully
            }
        }

        return Result.Success();
    }
}

