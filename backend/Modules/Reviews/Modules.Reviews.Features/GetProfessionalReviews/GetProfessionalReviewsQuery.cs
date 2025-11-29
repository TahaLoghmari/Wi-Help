using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetProfessionalReviews;

public sealed record GetProfessionalReviewsQuery(
    Guid ProfessionalId,
    int Page,
    int PageSize,
    Guid? CurrentUserId = null) : IQuery<PaginationResultDto<GetProfessionalReviewsDto>>;

