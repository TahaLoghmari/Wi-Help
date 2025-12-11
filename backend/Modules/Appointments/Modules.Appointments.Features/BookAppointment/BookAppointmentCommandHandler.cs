using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Common.Infrastructure.Services;
using Modules.Common.Infrastructure.Templates;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Identity.PublicApi;

namespace Modules.Appointments.Features.BookAppointment;

public class BookAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<BookAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IIdentityModuleApi identityModuleApi,
    EmailService emailService) : ICommandHandler<BookAppointmentCommand>
{
    public async Task<Result> Handle(BookAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Booking appointment for patient {PatientId} with professional {ProfessionalId} on {StartDate} - {EndDate}",
            command.PatientId, command.ProfessionalId, command.StartDate, command.EndDate);

        var appointment = new Appointment(
            command.PatientId,
            command.ProfessionalId,
            command.StartDate,
            command.EndDate,
            command.Price,
            command.Urgency,
            command.Notes);

        appointmentsDbContext.Appointments.Add(appointment);
        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment scheduled with ID {AppointmentId}", appointment.Id);

        // Get professional's UserId from ProfessionalId for SignalR notification
        // SignalR uses UserId (the 'sub' claim) to identify users, not ProfessionalId
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync([command.ProfessionalId], cancellationToken);
        if (!professionalResult.IsSuccess)
        {
            logger.LogError("Failed to fetch professional details for ID {ProfessionalId}: {Error}", command.ProfessionalId, professionalResult.Error);
            // Don't fail the appointment booking if we can't send notification
            return Result.Success();
        }

        var professional = professionalResult.Value.FirstOrDefault();
        if (professional is null)
        {
            logger.LogWarning("Professional not found for ID {ProfessionalId}", command.ProfessionalId);
            return Result.Success();
        }

        // Get patient information for notification and email
        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync([command.PatientId], cancellationToken);
        if (!patientResult.IsSuccess || !patientResult.Value.Any())
        {
            logger.LogWarning("Failed to fetch patient details for notification: {Error}", patientResult.Error);
            // Send notification without patient name
            await notificationsModuleApi.AddNotificationAsync(
                professional.UserId.ToString(),
                "Professional",
                "New Appointment Booked",
                "A patient has booked an appointment with you.",
                NotificationType.newAppointment,
                cancellationToken);
            return Result.Success();
        }

        var patient = patientResult.Value.First();
        var patientName = $"{patient.FirstName} {patient.LastName}";
        var professionalName = $"{professional.FirstName} {professional.LastName}";

        // Send notification to professional's UserId (not ProfessionalId)
        await notificationsModuleApi.AddNotificationAsync(
            professional.UserId.ToString(),
            "Professional",
            "New Appointment Booked",
            $"{patientName} has booked an appointment with you.",
            NotificationType.newAppointment,
            cancellationToken);

        // Get patient information for email
        if (patientResult.IsSuccess && patientResult.Value.Any())
        {
            
            // Send email to professional
            var emailBody = AppointmentEmailTemplates.AppointmentBooked(
                professionalName,
                patientName,
                patient.Email,
                patient.PhoneNumber,
                command.StartDate,
                command.EndDate,
                command.Urgency.ToString(),
                command.Price,
                command.Notes);
            
            var emailDto = new EmailDto(
                professional.Email,
                "New Appointment Booked - Wi Help",
                emailBody,
                true);
            
            emailService.EnqueueEmail(emailDto);
            logger.LogInformation("Email notification queued for professional {ProfessionalId}", command.ProfessionalId);
        }
        else
        {
            logger.LogWarning("Failed to fetch patient details for email notification: {Error}", patientResult.Error);
        }

        // Notify Admins
        var adminsResult = await identityModuleApi.GetUsersByRoleAsync("admin", cancellationToken);
        if (adminsResult.IsSuccess)
        {
            foreach (var admin in adminsResult.Value)
            {
                await notificationsModuleApi.AddNotificationAsync(
                    admin.Id.ToString(),
                    "Admin",
                    "New Appointment Booked",
                    $"New appointment booked: {professionalName} with {patientName}",
                    NotificationType.newAppointment,
                    cancellationToken);
            }
        }

        return Result.Success();
    }
}