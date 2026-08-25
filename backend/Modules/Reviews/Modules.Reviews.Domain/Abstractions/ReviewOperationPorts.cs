using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Domain.Abstractions;

public interface ISubmitReviewPort
{
    Task<bool> ExistsAsync(Guid patientId, Guid professionalId, ReviewType type, CancellationToken cancellationToken);
    Task AddAsync(Review review, CancellationToken cancellationToken);
}

public interface IEditReviewPort
{
    Task<Review?> GetAsync(Guid reviewId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IDeleteReviewPort
{
    Task<Review?> GetAsync(Guid reviewId, CancellationToken cancellationToken);
    Task DeleteAsync(Review review, CancellationToken cancellationToken);
}

public interface ILikeReviewPort
{
    Task<bool> ReviewExistsAsync(Guid reviewId, CancellationToken cancellationToken);
    Task<ReviewLike?> GetLikeAsync(Guid reviewId, Guid userId, CancellationToken cancellationToken);
    Task AddLikeAsync(ReviewLike like, CancellationToken cancellationToken);
}

public interface IUnlikeReviewPort
{
    Task<ReviewLike?> GetLikeAsync(Guid reviewId, Guid userId, CancellationToken cancellationToken);
    Task RemoveLikeAsync(ReviewLike like, CancellationToken cancellationToken);
}

public interface IReplyToReviewPort
{
    Task<Review?> GetReviewAsync(Guid reviewId, CancellationToken cancellationToken);
    Task AddReplyAsync(ReviewReply reply, CancellationToken cancellationToken);
}

public interface IEditReplyPort
{
    Task<ReviewReply?> GetAsync(Guid reviewId, Guid replyId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}

public interface IDeleteReplyPort
{
    Task<ReviewReply?> GetAsync(Guid reviewId, Guid replyId, CancellationToken cancellationToken);
    Task DeleteAsync(ReviewReply reply, CancellationToken cancellationToken);
}

public interface IGetReviewsPort
{
    Task<ReviewsPage> GetAsync(ReviewSearchCriteria criteria, CancellationToken cancellationToken);
}

public interface IGetReviewsForAdminPort
{
    Task<AdminReviewsPage> GetAsync(int page, int pageSize, CancellationToken cancellationToken);
}

public interface IGetReviewStatsPort
{
    Task<ReviewStats> GetAsync(Guid subjectId, CancellationToken cancellationToken);
}

public sealed record ReviewsPage(
    List<Review> Reviews,
    int TotalCount,
    Dictionary<Guid, int> LikeCounts,
    List<Guid> LikedReviewIds,
    List<ReviewReply> Replies);

public sealed record ReviewSearchCriteria(
    Guid? ProfessionalSubjectId,
    Guid? PatientSubjectId,
    Guid? ProfessionalReviewerId,
    Guid? PatientReviewerId,
    int Page,
    int PageSize,
    Guid CallerUserId);

public sealed record AdminReviewsPage(List<Review> Reviews, int TotalCount);

public sealed record ReviewStats(double Average, int Count);
