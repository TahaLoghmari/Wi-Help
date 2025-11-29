namespace Modules.Notifications.Features;

public static class NotificationsEndpoints
{
    public const string GetNotifications = "notifications";
    public const string MarkNotificationAsRead = "notifications/{notificationId}/mark-as-read";
    public const string MarkNotificationsAsRead = "notifications/mark-as-read";
}