using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetConversations;

public class GetConversationsQueryHandler(
    MessagingDbContext messagingDbContext,
    IIdentityModuleApi identityApi,
    ILogger<GetConversationsQueryHandler> logger) : IQueryHandler<GetConversationsQuery, List<ConversationDto>>
{
    public async Task<Result<List<ConversationDto>>> Handle(GetConversationsQuery query, CancellationToken cancellationToken)
    {
        var conversations = await messagingDbContext.Conversations
            .Where(c => c.Participant1Id == query.UserId || c.Participant2Id == query.UserId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} conversations for user {UserId}", conversations.Count, query.UserId);

        var conversationDtos = new List<ConversationDto>();

        foreach (var conversation in conversations)
        {
            var otherParticipantId = conversation.GetOtherParticipant(query.UserId);

            // Get other participant's user info
            var userResult = await identityApi.GetUserByIdAsync(otherParticipantId, cancellationToken);
            if (userResult.IsFailure)
            {
                logger.LogWarning("Failed to get user {UserId} for conversation {ConversationId}",
                    otherParticipantId, conversation.Id);
                continue;
            }

            var otherParticipant = userResult.Value;

            // Get last message (DeletedAt filter is handled by global query filter)
            var lastMessage = await messagingDbContext.Messages
                .Where(m => m.ConversationId == conversation.Id)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            // Get unread count (DeletedAt filter is handled by global query filter)
            var unreadCount = await messagingDbContext.Messages
                .CountAsync(m =>
                    m.ConversationId == conversation.Id &&
                    m.SenderId != query.UserId &&
                    m.Status != Domain.Enums.MessageStatus.Read,
                    cancellationToken);

            conversationDtos.Add(new ConversationDto(
                conversation.Id,
                otherParticipantId,
                otherParticipant.FirstName,
                otherParticipant.LastName,
                otherParticipant.ProfilePictureUrl,
                lastMessage != null ? new MessageDto(
                    lastMessage.Id,
                    lastMessage.SenderId,
                    lastMessage.Content,
                    lastMessage.Status.ToString(),
                    lastMessage.CreatedAt,
                    lastMessage.DeliveredAt,
                    lastMessage.ReadAt) : null,
                unreadCount,
                conversation.LastMessageAt ?? conversation.CreatedAt
            ));
        }

        logger.LogInformation("Returning {Count} conversation DTOs for user {UserId}", conversationDtos.Count, query.UserId);

        return Result<List<ConversationDto>>.Success(conversationDtos);
    }
}

