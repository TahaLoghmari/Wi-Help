using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.RespondToAppointment;

public class RespondToAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<RespondToAppointmentCommandHandler> logger) : ICommandHandler<RespondToAppointmentCommand>
{
    public async Task<Result> Handle(RespondToAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional user {UserId} responding to appointment {AppointmentId} with action: {Action}",
            command.ProfessionalId, command.AppointmentId, command.IsAccepted ? "Accept" : "Reject");
        
        var appointment = await appointmentsDbContext.Appointments.FirstOrDefaultAsync(ap => ap.Id == command.AppointmentId 
            && ap.ProfessionalId == command.ProfessionalId, cancellationToken);
            
        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found", command.AppointmentId);
            return Result.Failure(
                Error.NotFound(
                    "Appointment.NotFound",
                    $"Appointment with ID '{command.AppointmentId}' not found."));
        }

        if (appointment.Status != AppointmentStatus.Offered)
        {
            logger.LogWarning(
                "Cannot respond to appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(
                Error.Problem(
                    "Appointment.InvalidStatus",
                    $"Appointment is in {appointment.Status} status and cannot be responded to."));
        }

        if (command.IsAccepted)
        {
            appointment.Confirm();
            logger.LogInformation("Appointment {AppointmentId} confirmed", command.AppointmentId);
        }
        else
        {
            appointment.Cancel();
            logger.LogInformation("Appointment {AppointmentId} cancelled", command.AppointmentId);
        }

        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}