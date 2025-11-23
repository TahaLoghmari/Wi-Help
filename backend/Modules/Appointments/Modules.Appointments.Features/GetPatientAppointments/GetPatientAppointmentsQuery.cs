using Modules.Appointments.Features.DTOs;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.GetPatientAppointments;

public sealed record GetPatientAppointmentsQuery(Guid PatientId, int Page, int PageSize) : IQuery<PagedResponse<AppointmentDto>>;
