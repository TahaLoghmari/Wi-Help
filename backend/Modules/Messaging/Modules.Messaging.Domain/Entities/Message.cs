using Modules.Messaging.Domain.Enums;

namespace Modules.Messaging.Domain.Entities;

public class Message
{
    public Guid Id { get; private set; }
    public Guid ConversationId { get; private set; }
    public Guid SenderId { get; private set; } // UserId
    public string Content { get; private set; } = string.Empty;
    public MessageStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? DeliveredAt { get; private set; }
    public DateTime? ReadAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }
    public bool IsDeleted => DeletedAt.HasValue;

    // Navigation properties
    public Conversation Conversation { get; private set; } = null!;

    private Message() { }

    public Message(
        Guid conversationId,
        Guid senderId,
        string content)
    {
        Id = Guid.NewGuid();
        ConversationId = conversationId;
        SenderId = senderId;
        Content = content;
        Status = MessageStatus.Sent;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkAsDelivered()
    {
        if (Status == MessageStatus.Sent)
        {
            Status = MessageStatus.Delivered;
            DeliveredAt = DateTime.UtcNow;
        }
    }

    public void MarkAsRead()
    {
        if (Status != MessageStatus.Read)
        {
            Status = MessageStatus.Read;
            ReadAt = DateTime.UtcNow;
            if (!DeliveredAt.HasValue)
            {
                DeliveredAt = DateTime.UtcNow;
            }
        }
    }

    public void Delete()
    {
        if (!IsDeleted)
        {
            DeletedAt = DateTime.UtcNow;
        }
    }
}

