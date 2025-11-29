namespace Modules.Reviews.Domain.Entities;

public class ReviewReply
{
    public Guid Id { get; private set; }
    public Guid ReviewId { get; private set; }
    public Guid UserId { get; private set; }
    public string Comment { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private ReviewReply() { }

    public ReviewReply(
        Guid reviewId,
        Guid userId,
        string comment)
    {
        Id = Guid.NewGuid();
        ReviewId = reviewId;
        UserId = userId;
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string comment)
    {
        if (!string.IsNullOrWhiteSpace(comment))
            Comment = comment;
        
        UpdatedAt = DateTime.UtcNow;
    }
}

