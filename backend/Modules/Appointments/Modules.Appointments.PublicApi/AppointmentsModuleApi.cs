using Modules.Common.Features.Results;

namespace Modules.Appointments.PublicApi;

public interface IAppointmentsModuleApi
{
    public Task<Result> ScheduleAppointmentAsync(
        Guid patientId,
        Guid professionalId,
        DateTime startDate,
        DateTime endDate,
        decimal price,
        string timeZoneId = "Africa/Tunis",
        string notes = "",
        CancellationToken cancellationToken = default);

    public Task<Result> RespondToAppointmentAsync(
        Guid appointmentId,
        Guid professionalId,
        bool isAccepted,
        CancellationToken cancellationToken = default);
}