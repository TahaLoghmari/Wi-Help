using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain.Enums;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.CancelAppointment;

public class CancelAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<CancelAppointmentCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi) : ICommandHandler<CancelAppointmentCommand>
{
    public async Task<Result> Handle(CancelAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Patient {PatientId} cancelling appointment {AppointmentId}",
            command.PatientId, command.AppointmentId);
        
        var appointment = await appointmentsDbContext.Appointments.FirstOrDefaultAsync(
            ap => ap.Id == command.AppointmentId && ap.PatientId == command.PatientId, 
            cancellationToken);
            
        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found for patient {PatientId}", 
                command.AppointmentId, command.PatientId);
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

        // Get patient information
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
        }

        appointment.Cancel();
        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment {AppointmentId} cancelled by patient", command.AppointmentId);

        return Result.Success();
    }
}
