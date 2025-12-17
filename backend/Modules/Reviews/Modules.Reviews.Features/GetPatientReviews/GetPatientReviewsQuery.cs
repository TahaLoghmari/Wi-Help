using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetPatientReviews;

public sealed record GetPatientReviewsQuery(
    Guid PatientId,
    int Page,
    int PageSize,
    Guid? CurrentUserId) : IQuery<PaginationResultDto<GetPatientReviewsDto>>;
