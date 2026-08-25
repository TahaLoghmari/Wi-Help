using Modules.Common.Features.Abstractions;
using Modules.Common.Features.DTOs;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

public sealed record GetProfessionalsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<GetProfessionalsForAdminDto>>;
