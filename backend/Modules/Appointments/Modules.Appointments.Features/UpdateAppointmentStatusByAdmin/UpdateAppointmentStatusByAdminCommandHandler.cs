using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Errors;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.UpdateAppointmentStatusByAdmin;

public sealed class UpdateAppointmentStatusByAdminCommandHandler(
    AppointmentsDbContext dbContext,
    ILogger<UpdateAppointmentStatusByAdminCommandHandler> logger)
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

        return Result.Success();
    }
}
