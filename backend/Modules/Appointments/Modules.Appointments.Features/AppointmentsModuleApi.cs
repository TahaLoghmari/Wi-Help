using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features;

public sealed class AppointmentsModuleApi(AppointmentsDbContext dbContext) : IAppointmentsModuleApi
{
    public async Task<Result<IReadOnlyList<BookedSession>>> GetBookedSessionsAsync(
        Guid professionalId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken = default)
    {
        var sessions = await dbContext.Appointments
            .AsNoTracking()
            .Where(appointment => appointment.ProfessionalId == professionalId &&
                                  appointment.StartDate < to &&
                                  appointment.EndDate > from &&
                                  (appointment.Status == AppointmentStatus.Offered ||
                                   appointment.Status == AppointmentStatus.Confirmed))
            .Select(appointment => new BookedSession(appointment.StartDate, appointment.EndDate))
            .ToListAsync(cancellationToken);

        return Result<IReadOnlyList<BookedSession>>.Success(sessions);
    }
}
