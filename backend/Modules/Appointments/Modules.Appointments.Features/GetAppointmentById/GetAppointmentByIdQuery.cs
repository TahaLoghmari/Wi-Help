using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.GetAppointmentById;

public sealed record GetAppointmentByIdQuery(Guid AppointmentId, Guid ProfessionalId) : IQuery<GetAppointmentByIdDto>;
