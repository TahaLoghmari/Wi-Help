using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetPatientAppointments;

public sealed record GetPatientAppointmentsQuery(Guid UserId, int Page, int PageSize) : IQuery<PaginationResultDto<GetPatientAppointmentsDto>>;
