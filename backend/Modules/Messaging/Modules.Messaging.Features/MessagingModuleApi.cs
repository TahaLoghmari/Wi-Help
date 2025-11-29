using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features;

public class MessagingModuleApi(
    MessagingDbContext messagingDbContext,
    IIdentityModuleApi identityApi,
    ILogger<MessagingModuleApi> logger) : IMessagingModuleApi
{
    public async Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default)
    {
        // Check if conversation already exists
        var existingConversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c =>
                (c.Participant1Id == participant1Id && c.Participant2Id == participant2Id) ||
                (c.Participant1Id == participant2Id && c.Participant2Id == participant1Id),
                cancellationToken);

        if (existingConversation != null)
        {
            return Result<Guid>.Success(existingConversation.Id);
        }

        var conversation = new Domain.Entities.Conversation(
            participant1Id,
            participant2Id,
            Domain.Enums.ConversationType.ProfessionalPatient);

        messagingDbContext.Conversations.Add(conversation);
        await messagingDbContext.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(conversation.Id);
    }

    public async Task<Result<List<ConversationDto>>> GetConversationsByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var conversations = await messagingDbContext.Conversations
            .Where(c => c.Participant1Id == userId || c.Participant2Id == userId)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync(cancellationToken);

        var conversationDtos = new List<ConversationDto>();

        foreach (var conversation in conversations)
        {
            var otherParticipantId = conversation.GetOtherParticipant(userId);

            var userResult = await identityApi.GetUserByIdAsync(otherParticipantId, cancellationToken);
            if (userResult.IsFailure)
            {
                logger.LogWarning("Failed to get user {UserId} for conversation {ConversationId}",
                    otherParticipantId, conversation.Id);
                continue;
            }

            var otherParticipant = userResult.Value;

            // DeletedAt filter is handled by global query filter in MessagingDbContext
            var lastMessage = await messagingDbContext.Messages
                .Where(m => m.ConversationId == conversation.Id)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            var unreadCount = await messagingDbContext.Messages
                .CountAsync(m =>
                    m.ConversationId == conversation.Id &&
                    m.SenderId != userId &&
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

        return Result<List<ConversationDto>>.Success(conversationDtos);
    }

    public async Task<Result<MessagesResponseDto>> GetMessagesByConversationIdAsync(
        Guid conversationId,
        Guid userId,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var conversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);

        if (conversation == null)
        {
            return Result<MessagesResponseDto>.Failure(
                Modules.Common.Features.Results.Error.NotFound("Messaging.ConversationNotFound", $"Conversation with ID '{conversationId}' not found."));
        }

        if (!conversation.IsParticipant(userId))
        {
            return Result<MessagesResponseDto>.Failure(
                Modules.Common.Features.Results.Error.Forbidden("Messaging.NotParticipant", "You are not a participant in this conversation."));
        }

        // DeletedAt filter is handled by global query filter in MessagingDbContext
        var totalCount = await messagingDbContext.Messages
            .CountAsync(m => m.ConversationId == conversationId, cancellationToken);

        var messages = await messagingDbContext.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.Content,
                m.Status.ToString(),
                m.CreatedAt,
                m.DeliveredAt,
                m.ReadAt))
            .ToListAsync(cancellationToken);

        messages.Reverse();

        var response = new MessagesResponseDto(
            messages,
            pageNumber,
            pageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)pageSize));

        return Result<MessagesResponseDto>.Success(response);
    }
}

