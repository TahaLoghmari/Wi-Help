using Modules.Notifications.Domain.Enums;

namespace Modules.Notifications.Domain.Entities;

public class Notification
{
    public Guid Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public NotificationType Type { get; private set; }  
    public bool IsRead { get; private set; } = false ;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Notification() { } // EF Core

    public Notification(string userId, string title, string message, NotificationType type)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title;
        Message = message;
        Type = type;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkAsRead()
    {
        IsRead = true;
    }
}