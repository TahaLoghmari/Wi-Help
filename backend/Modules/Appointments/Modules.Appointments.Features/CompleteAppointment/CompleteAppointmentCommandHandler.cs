using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Identity.PublicApi;

namespace Modules.Appointments.Features.CompleteAppointment;

public class CompleteAppointmentCommandHandler(
    IAppointmentWorkflow appointmentsWorkflow,
    ILogger<CompleteAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi,
    IIdentityModuleApi identityModuleApi,
    IFileStorage fileStorage) : ICommandHandler<CompleteAppointmentCommand>
{
    private const string PrescriptionsBucketName = "prescriptions";

    public async Task<Result> Handle(CompleteAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Professional {ProfessionalId} completing appointment {AppointmentId}",
            command.ProfessionalId, command.AppointmentId);
        
        var intent = await appointmentsWorkflow.PrepareProfessionalCompletionAsync(
            command.AppointmentId,
            command.ProfessionalId,
            cancellationToken);
            
        if (intent is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found for professional {ProfessionalId}", 
                command.AppointmentId, command.ProfessionalId);
            return Result.Failure(AppointmentErrors.AppointmentNotFound(command.AppointmentId));
        }

        var appointment = intent.Appointment;
        if (!intent.CanTransition)
        {
            logger.LogWarning(
                "Cannot complete appointment {AppointmentId} in status {Status}",
                command.AppointmentId, appointment.Status);
            return Result.Failure(AppointmentErrors.InvalidStatus(appointment.Status, "marked as completed. Only confirmed appointments can be completed"));
        }

        // Validate PDF file
        if (command.PrescriptionPdf == null || command.PrescriptionPdf.Length == 0)
        {
            return Result.Failure(AppointmentErrors.PrescriptionPdfRequired());
        }

        var allowedContentTypes = new[] { "application/pdf" };
        if (!allowedContentTypes.Contains(command.PrescriptionPdf.ContentType.ToLower()))
        {
            return Result.Failure(AppointmentErrors.InvalidPrescriptionFileType());
        }

        // Upload prescription PDF to storage
        string pdfUrl;
        try
        {
            var fileName = $"prescription_{appointment.PatientId}_{appointment.Id}";
            pdfUrl = await fileStorage.UploadFileAsync(
                command.PrescriptionPdf,
                fileName,
                PrescriptionsBucketName,
                cancellationToken);
            
            logger.LogInformation("Prescription PDF uploaded: {PdfUrl}", pdfUrl);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upload prescription PDF for appointment {AppointmentId}", command.AppointmentId);
            return Result.Failure(AppointmentErrors.PrescriptionUploadFailed());
        }

        // Create prescription record
        var prescription = new Prescription(
            appointment.Id,
            appointment.PatientId,
            appointment.ProfessionalId,
            pdfUrl,
            command.PrescriptionTitle,
            command.PrescriptionNotes);

        await appointmentsWorkflow.CompleteWithPrescriptionAsync(intent, prescription, cancellationToken);

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
