using Modules.Common.Features.Results;

namespace Modules.Appointments.Domain.Errors;

public static class AppointmentErrors
{
    public static Error AppointmentNotFound(Guid appointmentId) =>
        Error.NotFound(
            "Appointment.NotFound",
            $"The appointment with Id '{appointmentId}' was not found.");
}
