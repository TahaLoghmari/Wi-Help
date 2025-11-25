using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.RespondToAppointment;

public record RespondToAppointmentCommand(
    Guid AppointmentId,
    Guid ProfessionalId,
    bool IsAccepted
) : ICommand;