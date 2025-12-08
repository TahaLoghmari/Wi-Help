using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

public sealed record GetProfessionalsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<GetProfessionalsForAdminDto>>;
