using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetMessages;

public class GetMessagesQueryHandler(
    IGetMessagesStore messageStore,
    ILogger<GetMessagesQueryHandler> logger) : IQueryHandler<GetMessagesQuery, MessagesResponseDto>
{
    public async Task<Result<MessagesResponseDto>> Handle(GetMessagesQuery query, CancellationToken cancellationToken)
    {
        // Verify conversation exists and user is a participant
        var conversation = await messageStore.GetConversationAsync(query.ConversationId, cancellationToken);

        if (conversation == null)
        {
            logger.LogWarning("Conversation {ConversationId} not found", query.ConversationId);
            return Result<MessagesResponseDto>.Failure(MessagingErrors.ConversationNotFound(query.ConversationId));
        }

        if (!conversation.IsParticipant(query.UserId))
        {
            logger.LogWarning("User {UserId} is not a participant in conversation {ConversationId}",
                query.UserId, query.ConversationId);
            return Result<MessagesResponseDto>.Failure(MessagingErrors.NotParticipant());
        }

        var page = await messageStore.GetPageAsync(
            query.ConversationId,
            query.PageNumber,
            query.PageSize,
            cancellationToken);

        var messages = page.Messages
            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.Content,
                m.Status.ToString(),
                m.CreatedAt,
                m.DeliveredAt,
                m.ReadAt))
            .ToList();

        // Reverse to show oldest first
        var orderedMessages = messages.AsEnumerable().Reverse().ToList();

        var response = new MessagesResponseDto(
            orderedMessages,
            query.PageNumber,
            query.PageSize,
            page.TotalCount,
            (int)Math.Ceiling(page.TotalCount / (double)query.PageSize));

        return Result<MessagesResponseDto>.Success(response);
    }
}
