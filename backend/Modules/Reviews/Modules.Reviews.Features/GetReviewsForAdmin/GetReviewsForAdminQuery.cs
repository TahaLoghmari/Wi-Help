using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Reviews.Features.GetReviewsForAdmin;

public sealed record GetReviewsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<ReviewAdminDto>>;
