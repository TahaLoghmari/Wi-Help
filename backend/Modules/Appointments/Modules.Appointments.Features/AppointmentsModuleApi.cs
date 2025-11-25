using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features;

public class AppointmentsModuleApi(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<AppointmentsModuleApi> logger)
    : IAppointmentsModuleApi
{

    public async Task<Result> RespondToAppointmentAsync(
        Guid appointmentId,
        Guid professionalId,
        bool isAccepted,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Professional {ProfessionalId} responding to appointment {AppointmentId} with action: {Action}",
            professionalId, appointmentId, isAccepted ? "Accept" : "Reject");
            var appointment =
                await appointmentsDbContext.Appointments.FirstOrDefaultAsync(ap => ap.Id == appointmentId,
                    cancellationToken);
            
        if (appointment == null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found", appointmentId);
            return Result.Failure(
                Error.NotFound(
                    "Appointment.NotFound",
                    $"Appointment with ID '{appointmentId}' not found."));
        }

        if (appointment.ProfessionalId != professionalId)
        {
            logger.LogWarning(
                "Professional {ProfessionalId} attempted to respond to appointment {AppointmentId} belonging to another professional",
                professionalId, appointmentId);
            return Result.Failure(
                Error.Forbidden(
                    "Appointment.NotAuthorized",
                    "You are not authorized to respond to this appointment."));
        }

        if (appointment.Status != AppointmentStatus.Offered)
        {
            logger.LogWarning(
                "Cannot respond to appointment {AppointmentId} in status {Status}",
                appointmentId, appointment.Status);
            return Result.Failure(
                Error.Problem(
                    "Appointment.InvalidStatus",
                    $"Appointment is in {appointment.Status} status and cannot be responded to."));
        }

        if (isAccepted)
        {
            appointment.Confirm();
            logger.LogInformation("Appointment {AppointmentId} confirmed", appointmentId);
        }
        else
        {
            appointment.Cancel();
            logger.LogInformation("Appointment {AppointmentId} cancelled", appointmentId);
        }

        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}