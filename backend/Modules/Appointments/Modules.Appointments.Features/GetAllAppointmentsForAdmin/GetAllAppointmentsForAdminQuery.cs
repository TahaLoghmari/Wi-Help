using Modules.Common.Features.Abstractions;
using Modules.Common.Features.DTOs;

namespace Modules.Appointments.Features.GetAllAppointmentsForAdmin;

public sealed record GetAllAppointmentsForAdminQuery(int Page, int PageSize) 
    : IQuery<PaginationResultDto<GetAllAppointmentsForAdminDto>>;
