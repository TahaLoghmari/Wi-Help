using Modules.Notifications.Domain.Enums;

namespace Modules.Notifications.Domain;

public sealed record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    NotificationType Type,
    bool IsRead,
    DateTime CreatedAt);