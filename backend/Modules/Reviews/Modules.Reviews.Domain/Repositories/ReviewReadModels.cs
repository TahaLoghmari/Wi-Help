using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Domain.Repositories;

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
