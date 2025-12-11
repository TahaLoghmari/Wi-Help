using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Common.Infrastructure.Services;
using Modules.Common.Infrastructure.Templates;
using Modules.Messaging.PublicApi;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;
using Modules.Identity.PublicApi;

namespace Modules.Appointments.Features.RespondToAppointment;

public class RespondToAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<RespondToAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IMessagingModuleApi messagingModuleApi,
    IIdentityModuleApi identityModuleApi,
    EmailService emailService) : ICommandHandler<RespondToAppointmentCommand>
{
    public async Task<Result> Handle(RespondToAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional user {UserId} responding to appointment {AppointmentId} with action: {Action}",
            command.ProfessionalId, command.AppointmentId, command.IsAccepted ? "Accept" : "Cancel");
        
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
        ProfessionalDto? professional = null;
        if (professionalResult.IsSuccess && professionalResult.Value.Any())
        {
            professional = professionalResult.Value.First();
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

            // Create conversation between patient and professional
            if (professional != null)
            {
                logger.LogInformation("Creating conversation for appointment {AppointmentId}. Patient UserId: {PatientUserId}, Professional UserId: {ProfessionalUserId}",
                    command.AppointmentId, patient.UserId, professional.UserId);
                
                var conversationResult = await messagingModuleApi.CreateConversationAsync(
                    patient.UserId,
                    professional.UserId,
                    cancellationToken);
                if (!conversationResult.IsSuccess)
                {
                    logger.LogError("Failed to create conversation for appointment {AppointmentId}: {Error}", command.AppointmentId, conversationResult.Error);
                    // Note: We don't fail the appointment acceptance if conversation creation fails
                }
                else
                {
                    logger.LogInformation("Conversation {ConversationId} created for appointment {AppointmentId}", conversationResult.Value, command.AppointmentId);
                }
            }
            
            // Send email to patient about acceptance
            if (professional != null)
            {
                var emailBody = AppointmentEmailTemplates.AppointmentAccepted(
                    $"{patient.FirstName} {patient.LastName}",
                    professionalName,
                    professional.Email,
                    professional.PhoneNumber,
                    professional.Specialization,
                    appointment.StartDate,
                    appointment.EndDate,
                    appointment.Urgency.ToString(),
                    appointment.Price,
                    appointment.Notes);
                
                var emailDto = new EmailDto(
                    patient.Email,
                    "Appointment Accepted - Wi Help",
                    emailBody,
                    true);
                
                emailService.EnqueueEmail(emailDto);
                logger.LogInformation("Acceptance email notification queued for patient {PatientId}", appointment.PatientId);
            }

            // Notify Admins
            var adminsResult = await identityModuleApi.GetUsersByRoleAsync("admin", cancellationToken);
            if (adminsResult.IsSuccess)
            {
                var patientName = $"{patient.FirstName} {patient.LastName}";
                foreach (var admin in adminsResult.Value)
                {
                    await notificationsModuleApi.AddNotificationAsync(
                        admin.Id.ToString(),
                        "Admin",
                        "Appointment Confirmed",
                        $"Appointment confirmed: {professionalName} with {patientName}",
                        NotificationType.appointmentAccepted,
                        cancellationToken);
                }
            }
        }
        else
        {
            appointment.Cancel();
            logger.LogInformation("Appointment {AppointmentId} cancelled", command.AppointmentId);

            // Send notification to patient
            await notificationsModuleApi.AddNotificationAsync(
                patient.UserId.ToString(),
                "Patient",
                "Appointment Cancelled",
                $"{professionalName} has cancelled your appointment request.",
                NotificationType.appointmentRejected,
                cancellationToken);
            
            // Send email to patient about rejection
            var emailBody = AppointmentEmailTemplates.AppointmentRejected(
                $"{patient.FirstName} {patient.LastName}",
                professionalName,
                appointment.StartDate,
                appointment.EndDate,
                appointment.Urgency.ToString(),
                appointment.Price);
            
            var emailDto = new EmailDto(
                patient.Email,
                "Appointment Update - Wi Help",
                emailBody,
                true);
            
            emailService.EnqueueEmail(emailDto);
            logger.LogInformation("Rejection email notification queued for patient {PatientId}", appointment.PatientId);

            // Notify Admins
            var adminsResult = await identityModuleApi.GetUsersByRoleAsync("admin", cancellationToken);
            if (adminsResult.IsSuccess)
            {
                var patientName = $"{patient.FirstName} {patient.LastName}";
                foreach (var admin in adminsResult.Value)
                {
                    await notificationsModuleApi.AddNotificationAsync(
                        admin.Id.ToString(),
                        "Admin",
                        "Appointment Rejected",
                        $"Appointment rejected by professional: {professionalName} with {patientName}",
                        NotificationType.appointmentRejected,
                        cancellationToken);
                }
            }
        }

        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}


