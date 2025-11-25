using Modules.Common.Features.Results;

namespace Modules.Appointments.PublicApi;

public interface IAppointmentsModuleApi
{
    public Task<Result> RespondToAppointmentAsync(
        Guid appointmentId,
        Guid professionalId,
        bool isAccepted,
        CancellationToken cancellationToken = default);
}