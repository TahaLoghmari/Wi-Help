using Modules.Common.Features.Results;

namespace Modules.Notifications.Domain;

public static class NotificationErrors
{
    public static Error NotFound(Guid id) => Error.NotFound(
        "Notification.NotFound",
        $"Notification with ID '{id}' not found.");

    public static Error NoUnread() => Error.Failure(
        "Notification.NoUnread",
        "No unread notifications found.");
}
