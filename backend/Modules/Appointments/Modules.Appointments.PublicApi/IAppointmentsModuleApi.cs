using Modules.Common.Features.Results;

namespace Modules.Appointments.PublicApi;

public interface IAppointmentsModuleApi
{
    Task<Result<IReadOnlyList<BookedSession>>> GetBookedSessionsAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default);
}
