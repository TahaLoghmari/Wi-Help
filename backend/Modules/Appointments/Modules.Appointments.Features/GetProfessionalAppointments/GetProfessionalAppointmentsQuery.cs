using Modules.Appointments.Features.DTOs;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public sealed record GetProfessionalAppointmentsQuery(Guid ProfessionalId, int Page, int PageSize) : IQuery<PagedResponse<AppointmentDto>>;
