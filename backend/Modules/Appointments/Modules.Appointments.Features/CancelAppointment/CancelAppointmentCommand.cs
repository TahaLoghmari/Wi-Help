using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.CancelAppointment;

public record CancelAppointmentCommand(
    Guid AppointmentId,
    Guid PatientId
) : ICommand;
