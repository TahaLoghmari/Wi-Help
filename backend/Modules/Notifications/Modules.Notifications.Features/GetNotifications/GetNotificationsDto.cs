using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Enums;

namespace Modules.Notifications.Features.GetNotifications;

public sealed record GetNotificationsDto(
    Guid Id,
    string Title,
    string Message,
    NotificationType Type,
    bool IsRead,
    DateTime CreatedAt);