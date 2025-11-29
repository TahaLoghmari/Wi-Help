namespace Modules.Messaging.PublicApi.Contracts;

public sealed record MessageDto(
    Guid Id,
    Guid SenderId,
    string Content,
    string Status,
    DateTime CreatedAt,
    DateTime? DeliveredAt,
    DateTime? ReadAt
);

