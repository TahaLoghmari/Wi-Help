using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Domain.Repositories;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Appointments.Features.Templates;
using Modules.Common.Features.DTOs;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Identity.PublicApi;

namespace Modules.Appointments.Features.CancelAppointment;

public class CancelAppointmentCommandHandler(
    IAppointmentRepository appointments,
    ILogger<CancelAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IIdentityModuleApi identityModuleApi,
    IEmailSender emailService) : ICommandHandler<CancelAppointmentCommand>
{
    public async Task<Result> Handle(CancelAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Patient {PatientId} cancelling appointment {AppointmentId}",
            command.PatientId, command.AppointmentId);
        
        var appointment = await appointments.GetForPatientAsync(
            command.AppointmentId,
            command.PatientId,
            cancellationToken);
            
        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found for patient {PatientId}", 
                command.AppointmentId, command.PatientId);
            return Result.Failure(AppointmentErrors.AppointmentNotFound(command.AppointmentId));
        }

        if (appointment.Status != AppointmentStatus.Offered && appointment.Status != AppointmentStatus.Confirmed)
        {
            logger.LogWarning(
                "Cannot cancel appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(AppointmentErrors.InvalidStatus(appointment.Status, "cancelled"));
        }

        // Get patient information
        appointment.Cancel();

        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync([appointment.PatientId], cancellationToken);
        if (!patientResult.IsSuccess)
        {
            logger.LogError("Failed to fetch patient details for ID {PatientId}: {Error}", 
                appointment.PatientId, patientResult.Error);
            return Result.Failure(patientResult.Error);
        }

        var patient = patientResult.Value.First();
        var patientName = $"{patient.FirstName} {patient.LastName}";

        // Get professional information for notification
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync(
            [appointment.ProfessionalId], cancellationToken);
        
        if (!professionalResult.IsSuccess || !professionalResult.Value.Any())
        {
            logger.LogError("Failed to fetch professional details for ID {ProfessionalId}: {Error}", 
                appointment.ProfessionalId, professionalResult.Error);
            // Continue with cancellation even if we can't notify
        }
        else
        {
            var professional = professionalResult.Value.First();

            // Send notification to professional about cancellation
            await notificationsModuleApi.AddNotificationAsync(
                professional.UserId.ToString(),
                "Professional",
                "Appointment Cancelled",
                $"{patientName} has cancelled their appointment.",
                NotificationType.appointmentRejected,
                cancellationToken);
            
            // Send email to professional about cancellation
            var emailBody = AppointmentEmailTemplates.AppointmentCancelledByPatient(
                $"{professional.FirstName} {professional.LastName}",
                patientName,
                appointment.StartDate,
                appointment.EndDate,
                appointment.Urgency.ToString(),
                appointment.Price);
            
            var emailDto = new EmailDto(
                professional.Email,
                "Appointment Cancelled by Patient - Wi Help",
                emailBody,
                true);
            
            emailService.EnqueueEmail(emailDto);
            logger.LogInformation("Cancellation email notification queued for professional {ProfessionalId}", appointment.ProfessionalId);

            // Notify Admins
            var adminsResult = await identityModuleApi.GetUsersByRoleAsync("admin", cancellationToken);
            if (adminsResult.IsSuccess)
            {
                var professionalName = $"{professional.FirstName} {professional.LastName}";
                foreach (var admin in adminsResult.Value)
                {
                    await notificationsModuleApi.AddNotificationAsync(
                        admin.Id.ToString(),
                        "Admin",
                        "Appointment Cancelled",
                        $"Appointment cancelled: {professionalName} with {patientName}",
                        NotificationType.appointmentCancelled,
                        cancellationToken);
                }
            }
        }

        await appointments.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment {AppointmentId} cancelled by patient", command.AppointmentId);

        return Result.Success();
    }
}
