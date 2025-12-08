using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetAllAppointmentsForAdmin;

public sealed record GetAllAppointmentsForAdminQuery(int Page, int PageSize) 
    : IQuery<PaginationResultDto<GetAllAppointmentsForAdminDto>>;
