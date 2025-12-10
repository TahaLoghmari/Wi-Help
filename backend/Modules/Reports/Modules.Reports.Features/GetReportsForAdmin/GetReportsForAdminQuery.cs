using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;
using Modules.Reports.Domain.Enums;

namespace Modules.Reports.Features.GetReportsForAdmin;

public sealed record GetReportsForAdminQuery(int Page, int PageSize, ReportType? Type = null) : IQuery<PaginationResultDto<ReportAdminDto>>;
