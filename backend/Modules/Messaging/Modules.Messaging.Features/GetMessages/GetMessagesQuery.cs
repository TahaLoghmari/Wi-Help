using Modules.Common.Features.Abstractions;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.Features.GetMessages;

public record GetMessagesQuery(
    Guid ConversationId,
    Guid UserId,
    int PageNumber = 1,
    int PageSize = 50
) : IQuery<MessagesResponseDto>;

