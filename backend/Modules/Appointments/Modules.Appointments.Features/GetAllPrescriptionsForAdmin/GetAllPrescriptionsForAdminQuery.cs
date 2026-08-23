using Modules.Common.Features.Abstractions;
using Modules.Common.Features.DTOs;

namespace Modules.Appointments.Features.GetAllPrescriptionsForAdmin;

public sealed record GetAllPrescriptionsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<PrescriptionAdminDto>>;
