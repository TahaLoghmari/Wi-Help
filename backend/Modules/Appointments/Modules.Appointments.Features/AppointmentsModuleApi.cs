using Modules.Appointments.Domain.Ports;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features;

public sealed class AppointmentsModuleApi(IGetBookedSessionsStore bookedSessionsStore) : IAppointmentsModuleApi
{
    public async Task<Result<IReadOnlyList<BookedSession>>> GetBookedSessionsAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var appointments = await bookedSessionsStore.GetAsync(professionalId, from, to, cancellationToken);
        var sessions = appointments.Select(appointment => new BookedSession(appointment.StartDate, appointment.EndDate)).ToList();

        return Result<IReadOnlyList<BookedSession>>.Success(sessions);
    }
}
