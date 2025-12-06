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
        // Fetch conversations with last message and unread count in optimized queries
        var conversationsWithData = await messagingDbContext.Conversations
            .Where(c => c.Participant1Id == query.UserId || c.Participant2Id == query.UserId)
            .Select(c => new
            {
                Conversation = c,
                LastMessage = c.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault(),
                UnreadCount = c.Messages
                    .Count(m => m.SenderId != query.UserId && m.Status != Domain.Enums.MessageStatus.Read)
            })
            .OrderByDescending(x => x.Conversation.LastMessageAt ?? x.Conversation.CreatedAt)
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} conversations for user {UserId}", conversationsWithData.Count, query.UserId);

        // Collect all other participant IDs for batch user lookup
        var otherParticipantIds = conversationsWithData
            .Select(x => x.Conversation.GetOtherParticipant(query.UserId))
            .Distinct()
            .ToList();

        // Batch fetch all users at once using the batch API
        var usersResult = await identityApi.GetUsersByIdsAsync(otherParticipantIds, cancellationToken);
        
        if (!usersResult.IsSuccess)
        {
            logger.LogError("Failed to fetch users for conversations: {Error}", usersResult.Error);
            return Result<List<ConversationDto>>.Failure(usersResult.Error);
        }

        var userLookup = usersResult.Value.ToDictionary(u => u.Id, u => u);

        var conversationDtos = new List<ConversationDto>();

        foreach (var data in conversationsWithData)
        {
            var otherParticipantId = data.Conversation.GetOtherParticipant(query.UserId);

            if (!userLookup.TryGetValue(otherParticipantId, out var otherParticipant))
            {
                logger.LogWarning("Failed to get user {UserId} for conversation {ConversationId}",
                    otherParticipantId, data.Conversation.Id);
                continue;
            }

            conversationDtos.Add(new ConversationDto(
                data.Conversation.Id,
                otherParticipantId,
                otherParticipant.FirstName,
                otherParticipant.LastName,
                otherParticipant.ProfilePictureUrl,
                data.LastMessage != null ? new MessageDto(
                    data.LastMessage.Id,
                    data.LastMessage.SenderId,
                    data.LastMessage.Content,
                    data.LastMessage.Status.ToString(),
                    data.LastMessage.CreatedAt,
                    data.LastMessage.DeliveredAt,
                    data.LastMessage.ReadAt) : null,
                data.UnreadCount,
                data.Conversation.LastMessageAt ?? data.Conversation.CreatedAt
            ));
        }

        logger.LogInformation("Returning {Count} conversation DTOs for user {UserId}", conversationDtos.Count, query.UserId);

        return Result<List<ConversationDto>>.Success(conversationDtos);
    }
}

