using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Common.Infrastructure.Services;
using Modules.Common.Infrastructure.Templates;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.CancelAppointmentByProfessional;

public class CancelAppointmentByProfessionalCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<CancelAppointmentByProfessionalCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    EmailService emailService) : ICommandHandler<CancelAppointmentByProfessionalCommand>
{
    public async Task<Result> Handle(CancelAppointmentByProfessionalCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional {ProfessionalId} cancelling appointment {AppointmentId}",
            command.ProfessionalId, command.AppointmentId);
        
        var appointment = await appointmentsDbContext.Appointments.FirstOrDefaultAsync(
            ap => ap.Id == command.AppointmentId && ap.ProfessionalId == command.ProfessionalId, 
            cancellationToken);
            
        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found for professional {ProfessionalId}", 
                command.AppointmentId, command.ProfessionalId);
            return Result.Failure(
                Error.NotFound(
                    "Appointment.NotFound",
                    $"Appointment with ID '{command.AppointmentId}' not found."));
        }

        if (appointment.Status != AppointmentStatus.Offered && appointment.Status != AppointmentStatus.Confirmed)
        {
            logger.LogWarning(
                "Cannot cancel appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(
                Error.Problem(
                    "Appointment.InvalidStatus",
                    $"Appointment is in {appointment.Status} status and cannot be cancelled."));
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
        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment {AppointmentId} cancelled by professional", command.AppointmentId);

        return Result.Success();
    }
}
