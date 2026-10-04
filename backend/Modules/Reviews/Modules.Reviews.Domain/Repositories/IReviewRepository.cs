using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Domain.Repositories;

public interface IReviewRepository
{
    Task<bool> ExistsAsync(Guid patientId, Guid professionalId, ReviewType type, CancellationToken cancellationToken);
    Task<bool> ReviewExistsAsync(Guid reviewId, CancellationToken cancellationToken);
    Task<Review?> GetByIdAsync(Guid reviewId, CancellationToken cancellationToken);
    Task<Review?> GetReviewAsync(Guid reviewId, CancellationToken cancellationToken);
    void Add(Review review);
    Task RemoveAsync(Review review, CancellationToken cancellationToken);
    Task<ReviewLike?> GetLikeAsync(Guid reviewId, Guid userId, CancellationToken cancellationToken);
    void AddLike(ReviewLike like);
    void RemoveLike(ReviewLike like);
    Task<ReviewReply?> GetReplyAsync(Guid reviewId, Guid replyId, CancellationToken cancellationToken);
    void AddReply(ReviewReply reply);
    void RemoveReply(ReviewReply reply);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<ReviewsPage> GetPageAsync(ReviewSearchCriteria criteria, CancellationToken cancellationToken);
    Task<AdminReviewsPage> GetAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<ReviewStats> GetStatsAsync(Guid subjectId, CancellationToken cancellationToken);
}
