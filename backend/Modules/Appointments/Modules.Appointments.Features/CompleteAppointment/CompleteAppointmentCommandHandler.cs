using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.Services;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Identity.PublicApi;

namespace Modules.Appointments.Features.CompleteAppointment;

public class CompleteAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<CompleteAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IIdentityModuleApi identityModuleApi,
    SupabaseService supabaseService) : ICommandHandler<CompleteAppointmentCommand>
{
    private const string PrescriptionsBucketName = "prescriptions";

    public async Task<Result> Handle(CompleteAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional {ProfessionalId} completing appointment {AppointmentId}",
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

        if (appointment.Status != AppointmentStatus.Confirmed)
        {
            logger.LogWarning(
                "Cannot complete appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(
                Error.Problem(
                    "Appointment.InvalidStatus",
                    $"Appointment is in {appointment.Status} status and cannot be marked as completed. Only confirmed appointments can be completed."));
        }

        // Validate PDF file
        if (command.PrescriptionPdf == null || command.PrescriptionPdf.Length == 0)
        {
            return Result.Failure(
                Error.Validation(
                    "Prescription.PdfRequired",
                    "A prescription PDF file is required to complete the appointment."));
        }

        var allowedContentTypes = new[] { "application/pdf" };
        if (!allowedContentTypes.Contains(command.PrescriptionPdf.ContentType.ToLower()))
        {
            return Result.Failure(
                Error.Validation(
                    "Prescription.InvalidFileType",
                    "Only PDF files are allowed for prescriptions."));
        }

        // Upload prescription PDF to storage
        string pdfUrl;
        try
        {
            var fileName = $"prescription_{appointment.PatientId}_{appointment.Id}";
            pdfUrl = await supabaseService.UploadFileAsync(
                command.PrescriptionPdf,
                fileName,
                PrescriptionsBucketName,
                cancellationToken);
            
            logger.LogInformation("Prescription PDF uploaded: {PdfUrl}", pdfUrl);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upload prescription PDF for appointment {AppointmentId}", command.AppointmentId);
            return Result.Failure(
                Error.Problem(
                    "Prescription.UploadFailed",
                    "Failed to upload the prescription PDF. Please try again."));
        }

        // Create prescription record
        var prescription = new Prescription(
            appointment.Id,
            appointment.PatientId,
            appointment.ProfessionalId,
            pdfUrl,
            command.PrescriptionTitle,
            command.PrescriptionNotes);

        appointmentsDbContext.Prescriptions.Add(prescription);

        // Mark appointment as completed
        appointment.Complete();

        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Appointment {AppointmentId} completed with prescription {PrescriptionId}", 
            command.AppointmentId, prescription.Id);

        // Get patient information for notification
        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync([appointment.PatientId], cancellationToken);
        if (!patientResult.IsSuccess || !patientResult.Value.Any())
        {
            logger.LogWarning("Failed to fetch patient details for ID {PatientId}", appointment.PatientId);
            return Result.Success();
        }

        var patient = patientResult.Value.First();

        // Get professional information for notification message
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync(
            [command.ProfessionalId], cancellationToken);
        var professionalName = "Your professional";
        if (professionalResult.IsSuccess && professionalResult.Value.Any())
        {
            var professional = professionalResult.Value.First();
            professionalName = $"{professional.FirstName} {professional.LastName}";
        }

        // Send notification to patient
        await notificationsModuleApi.AddNotificationAsync(
            patient.UserId.ToString(),
            "Patient",
            "Appointment Completed",
            $"{professionalName} has marked your appointment as completed and uploaded a prescription.",
            NotificationType.newPrescription,
            cancellationToken);

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
                    "Appointment Completed",
                    $"Appointment completed: {professionalName} with {patientName}",
                    NotificationType.appointmentCompleted,
                    cancellationToken);
            }
        }

        return Result.Success();
    }
}
