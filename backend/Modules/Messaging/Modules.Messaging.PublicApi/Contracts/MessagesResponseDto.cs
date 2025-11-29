namespace Modules.Messaging.PublicApi.Contracts;

public sealed record MessagesResponseDto(
    List<MessageDto> Messages,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);

