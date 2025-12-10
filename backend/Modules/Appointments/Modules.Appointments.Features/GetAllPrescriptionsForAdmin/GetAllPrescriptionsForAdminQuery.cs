using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetAllPrescriptionsForAdmin;

public sealed record GetAllPrescriptionsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<PrescriptionAdminDto>>;
