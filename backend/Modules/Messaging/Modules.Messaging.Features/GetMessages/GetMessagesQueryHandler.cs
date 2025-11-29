using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetMessages;

public class GetMessagesQueryHandler(
    MessagingDbContext messagingDbContext,
    ILogger<GetMessagesQueryHandler> logger) : IQueryHandler<GetMessagesQuery, MessagesResponseDto>
{
    public async Task<Result<MessagesResponseDto>> Handle(GetMessagesQuery query, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c => c.Id == query.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", query.ConversationId);
            return Result<MessagesResponseDto>.Failure(Error.NotFound("Messaging.ConversationNotFound", $"Conversation with ID '{query.ConversationId}' not found."));
        }

        if (!conversation.IsParticipant(query.UserId))
        {
            logger.LogWarning("User {UserId} is not a participant in conversation {ConversationId}",
                query.UserId, query.ConversationId);
            return Result<MessagesResponseDto>.Failure(Error.Forbidden("Messaging.NotParticipant", "You are not a participant in this conversation."));
        }

        var totalCount = await messagingDbContext.Messages
            .CountAsync(m => m.ConversationId == query.ConversationId && !m.IsDeleted, cancellationToken);

        var messages = await messagingDbContext.Messages
            .Where(m => m.ConversationId == query.ConversationId && !m.IsDeleted)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.Content,
                m.Status.ToString(),
                m.CreatedAt,
                m.DeliveredAt,
                m.ReadAt))
            .ToListAsync(cancellationToken);

        // Reverse to show oldest first
        messages.Reverse();

        var response = new MessagesResponseDto(
            messages,
            query.PageNumber,
            query.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)query.PageSize));

        return Result<MessagesResponseDto>.Success(response);
    }
}

