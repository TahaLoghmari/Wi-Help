using Modules.Messaging.Domain.Enums;

namespace Modules.Messaging.Domain.Entities;

public class Conversation
{
    public Guid Id { get; private set; }
    public Guid Participant1Id { get; private set; } // UserId (can be Professional or Patient)
    public Guid Participant2Id { get; private set; } // UserId (can be Professional or Patient)
    public ConversationType Type { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public DateTime? LastMessageAt { get; private set; }
    
    // Navigation properties
    public ICollection<Message> Messages { get; private set; } = new List<Message>();

    private Conversation() { }

    public Conversation(
        Guid participant1Id,
        Guid participant2Id,
        ConversationType type)
    {
        Id = Guid.NewGuid();
        Participant1Id = participant1Id;
        Participant2Id = participant2Id;
        Type = type;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLastMessageAt()
    {
        LastMessageAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsParticipant(Guid userId)
    {
        return Participant1Id == userId || Participant2Id == userId;
    }

    public Guid GetOtherParticipant(Guid userId)
    {
        if (Participant1Id == userId)
            return Participant2Id;
        if (Participant2Id == userId)
            return Participant1Id;
        
        throw new InvalidOperationException($"User {userId} is not a participant in this conversation");
    }
}

