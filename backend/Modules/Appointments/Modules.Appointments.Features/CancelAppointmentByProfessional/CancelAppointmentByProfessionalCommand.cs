using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.CancelAppointmentByProfessional;

public record CancelAppointmentByProfessionalCommand(
    Guid AppointmentId,
    Guid ProfessionalId
) : ICommand;
