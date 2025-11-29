using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.RespondToAppointment;

public class RespondToAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<RespondToAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi) : ICommandHandler<RespondToAppointmentCommand>
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

        // Get patient information before updating appointment status
        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync([appointment.PatientId], cancellationToken);
        if (!patientResult.IsSuccess)
        {
            logger.LogError("Failed to fetch patient details for ID {PatientId}: {Error}", appointment.PatientId, patientResult.Error);
            return Result.Failure(patientResult.Error);
        }

        var patient = patientResult.Value.First();

        // Get professional information for notification message
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync([command.ProfessionalId], cancellationToken);
        var professionalName = "Your professional";
        if (professionalResult.IsSuccess && professionalResult.Value.Any())
        {
            var professional = professionalResult.Value.First();
            professionalName = $"{professional.FirstName} {professional.LastName}";
        }

        if (command.IsAccepted)
        {
            appointment.Confirm();
            logger.LogInformation("Appointment {AppointmentId} confirmed", command.AppointmentId);

            // Send notification to patient
            await notificationsModuleApi.AddNotificationAsync(
                patient.UserId.ToString(),
                "Patient",
                "Appointment Accepted",
                $"{professionalName} has accepted your appointment request.",
                NotificationType.appointmentAccepted,
                cancellationToken);
        }
        else
        {
            appointment.Cancel();
            logger.LogInformation("Appointment {AppointmentId} cancelled", command.AppointmentId);

            // Send notification to patient
            await notificationsModuleApi.AddNotificationAsync(
                patient.UserId.ToString(),
                "Patient",
                "Appointment Rejected",
                $"{professionalName} has rejected your appointment request.",
                NotificationType.appointmentRejected,
                cancellationToken);
        }

        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}