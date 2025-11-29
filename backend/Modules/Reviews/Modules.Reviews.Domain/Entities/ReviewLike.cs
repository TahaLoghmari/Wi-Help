namespace Modules.Reviews.Domain.Entities;

public class ReviewLike
{
    public Guid Id { get; private set; }
    public Guid ReviewId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private ReviewLike() { }

    public ReviewLike(Guid reviewId, Guid userId)
    {
        Id = Guid.NewGuid();
        ReviewId = reviewId;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }
}

