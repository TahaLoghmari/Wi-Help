using Modules.Appointments.Features.DTOs;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.GetAppointments;

public sealed record GetAppointmentsQuery(int Page, int PageSize) : IQuery<PagedResponse<AppointmentDto>>;
