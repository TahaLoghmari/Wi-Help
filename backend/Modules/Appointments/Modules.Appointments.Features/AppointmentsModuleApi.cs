using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features;

public class AppointmentsModuleApi(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<AppointmentsModuleApi> logger)
    : IAppointmentsModuleApi
{
    public async Task<Result> ScheduleAppointmentAsync(
        Guid patientId,
        Guid professionalId,
        DateTime startDate,
        DateTime endDate,
        decimal price,
        string timeZoneId,
        string notes,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation(
            "Scheduling appointment for patient {PatientId} with professional {ProfessionalId} on {StartDate} - {EndDate}",
            patientId, professionalId, startDate, endDate);
        try
        {
            // Here you would add the logic to schedule the appointment in the database
            // For now, we just log the action


            // TODO : Later on Check for conflicting sessions

            // TODO : convert Date, StartTime, EndTime to DateTime with TimeZoneId to the timezone of the doctor : 
            // 
            /*var sessionStartDateTimeTimeZoneMentor = TimeConvertion.ConvertInstantToTimeZone(
                sessionStartDateTimeUtc,
                product.TimeZoneId == "" ? CommonDefaults.TimeZone : product.TimeZoneId);

            var requestedDayOfWeek = sessionStartDateTimeTimeZoneMentor.DayOfWeek;

            var sessionEndDateTimeTimeZoneMentor = TimeConvertion.ConvertInstantToTimeZone(
                sessionEndDateTimeUtc,
                product.TimeZoneId == "" ? CommonDefaults.TimeZone : product.TimeZoneId);*/

            var appointment =
                new Appointment(patientId, professionalId, notes, startDate, endDate, AppointmentUrgency.Medium,
                    price);
            await appointmentsDbContext.Appointments.AddAsync(appointment, cancellationToken);
            await appointmentsDbContext.SaveChangesAsync(cancellationToken);


            return Result.Success();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Scheduling appointment failed");
            return Result.Failure(Error.Failure("Scheduling.Appointment.Failed", "Scheduling appointment failed"));
        }
    }
}