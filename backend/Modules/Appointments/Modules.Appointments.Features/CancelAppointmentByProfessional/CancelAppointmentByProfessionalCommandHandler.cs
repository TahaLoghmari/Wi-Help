using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Appointments.Features.Templates;
using Modules.Common.Features.DTOs;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.CancelAppointmentByProfessional;

public class CancelAppointmentByProfessionalCommandHandler(
    ICancelAppointmentByProfessionalStore appointmentsStore,
    ILogger<CancelAppointmentByProfessionalCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IEmailSender emailService) : ICommandHandler<CancelAppointmentByProfessionalCommand>
{
    public async Task<Result> Handle(CancelAppointmentByProfessionalCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional {ProfessionalId} cancelling appointment {AppointmentId}",
            command.ProfessionalId, command.AppointmentId);
        
        var appointment = await appointmentsStore.GetAsync(
            command.AppointmentId,
            command.ProfessionalId,
            cancellationToken);
            
        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found for professional {ProfessionalId}", 
                command.AppointmentId, command.ProfessionalId);
            return Result.Failure(AppointmentErrors.AppointmentNotFound(command.AppointmentId));
        }

        if (appointment.Status != AppointmentStatus.Offered && appointment.Status != AppointmentStatus.Confirmed)
        {
            logger.LogWarning(
                "Cannot cancel appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(AppointmentErrors.InvalidStatus(appointment.Status, "cancelled"));
        }

        // Get professional information
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync(
            [command.ProfessionalId], cancellationToken);
        if (!professionalResult.IsSuccess)
        {
            logger.LogError("Failed to fetch professional details for ID {ProfessionalId}: {Error}", 
                command.ProfessionalId, professionalResult.Error);
            return Result.Failure(professionalResult.Error);
        }

        var professional = professionalResult.Value.First();
        var professionalName = $"{professional.FirstName} {professional.LastName}";

        // Get patient information for notification
        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync(
            [appointment.PatientId], cancellationToken);
        
        if (!patientResult.IsSuccess || !patientResult.Value.Any())
        {
            logger.LogError("Failed to fetch patient details for ID {PatientId}: {Error}", 
                appointment.PatientId, patientResult.Error);
            // Continue with cancellation even if we can't notify
        }
        else
        {
            var patient = patientResult.Value.First();

            // Send notification to patient about cancellation
            await notificationsModuleApi.AddNotificationAsync(
                patient.UserId.ToString(),
                "Patient",
                "Appointment Cancelled",
                $"{professionalName} has cancelled your appointment.",
                NotificationType.appointmentRejected,
                cancellationToken);
            
            // Send email to patient about cancellation
            var emailBody = AppointmentEmailTemplates.AppointmentCancelledByProfessional(
                $"{patient.FirstName} {patient.LastName}",
                professionalName,
                appointment.StartDate,
                appointment.EndDate,
                appointment.Urgency.ToString(),
                appointment.Price,
                appointment.Notes);
            
            var emailDto = new EmailDto(
                patient.Email,
                "Appointment Cancelled - Wi Help",
                emailBody,
                true);
            
            emailService.EnqueueEmail(emailDto);
            logger.LogInformation("Cancellation email notification queued for patient {PatientId}", appointment.PatientId);
        }

        appointment.Cancel();
        await appointmentsStore.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment {AppointmentId} cancelled by professional", command.AppointmentId);

        return Result.Success();
    }
}
