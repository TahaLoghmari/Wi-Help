using Modules.Common.Features.Results;
using Modules.Messaging.PublicApi.Contracts;

namespace Modules.Messaging.PublicApi;

public interface IMessagingModuleApi
{
    Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default);

    Task<Result<List<ConversationDto>>> GetConversationsByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<Result<MessagesResponseDto>> GetMessagesByConversationIdAsync(
        Guid conversationId,
        Guid userId,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);
}

