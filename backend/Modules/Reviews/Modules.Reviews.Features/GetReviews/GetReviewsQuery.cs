using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetReviews;

public sealed record GetReviewsQuery(
    Guid? SubjectId,
    Guid? ReviewerId,
    Guid? CallerPatientId,
    Guid? CallerProfessionalId,
    Guid CallerUserId,
    int Page,
    int PageSize) : IQuery<PaginationResultDto<ReviewDto>>;
