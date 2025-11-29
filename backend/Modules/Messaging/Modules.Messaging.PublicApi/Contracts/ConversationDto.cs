namespace Modules.Messaging.PublicApi.Contracts;

public sealed record ConversationDto(
    Guid Id,
    Guid OtherParticipantId,
    string OtherParticipantFirstName,
    string OtherParticipantLastName,
    string? OtherParticipantProfilePictureUrl,
    MessageDto? LastMessage,
    int UnreadCount,
    DateTime LastActivityAt
);

