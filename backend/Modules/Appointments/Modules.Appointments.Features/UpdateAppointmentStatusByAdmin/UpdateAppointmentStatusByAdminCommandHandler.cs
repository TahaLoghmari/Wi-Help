using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.PublicApi;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Notifications.Domain.Enums;
using Modules.Appointments.Domain.Enums;

namespace Modules.Appointments.Features.UpdateAppointmentStatusByAdmin;

public sealed class UpdateAppointmentStatusByAdminCommandHandler(
    AppointmentsDbContext dbContext,
    ILogger<UpdateAppointmentStatusByAdminCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi)
    : ICommandHandler<UpdateAppointmentStatusByAdminCommand>
{
    public async Task<Result> Handle(
        UpdateAppointmentStatusByAdminCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Admin updating appointment {AppointmentId} status to {Status}",
            command.AppointmentId,
            command.Status);

        var appointment = await dbContext.Appointments
            .FirstOrDefaultAsync(a => a.Id == command.AppointmentId, cancellationToken);

        if (appointment is null)
        {
            logger.LogWarning("Appointment {AppointmentId} not found", command.AppointmentId);
            return Result.Failure(AppointmentErrors.AppointmentNotFound(command.AppointmentId));
        }

        appointment.UpdateStatus(command.Status);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Successfully updated appointment {AppointmentId} status to {Status}",
            command.AppointmentId,
            command.Status);

        // Determine Notification Type
        NotificationType notificationType = command.Status switch
        {
            AppointmentStatus.Confirmed => NotificationType.appointmentAccepted,
            AppointmentStatus.Cancelled => NotificationType.appointmentCancelled,
            AppointmentStatus.Completed => NotificationType.appointmentCompleted,
            _ => NotificationType.appointmentStatusUpdated // Fallback
        };

        // Notify Patient
        var patientResult = await patientsModuleApi.GetPatientsByIdsAsync([appointment.PatientId], cancellationToken);
        if (patientResult.IsSuccess && patientResult.Value.Any())
        {
            var patient = patientResult.Value.First();
            await notificationsModuleApi.AddNotificationAsync(
                patient.UserId.ToString(),
                "Patient",
                "Appointment Status Updated",
                $"Your appointment status has been updated to {command.Status} by Admin.",
                notificationType,
                cancellationToken);
        }

        // Notify Professional
        var professionalResult = await professionalModuleApi.GetProfessionalsByIdsAsync([appointment.ProfessionalId], cancellationToken);
        if (professionalResult.IsSuccess && professionalResult.Value.Any())
        {
            var professional = professionalResult.Value.First();
            await notificationsModuleApi.AddNotificationAsync(
                professional.UserId.ToString(),
                "Professional",
                "Appointment Status Updated",
                $"Appointment status updated to {command.Status} by Admin.",
                notificationType,
                cancellationToken);
        }

        return Result.Success();
    }
}
