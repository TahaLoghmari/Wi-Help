using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Domain.Enums;
using Modules.Appointments.Infrastructure.Database;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;

namespace Modules.Appointments.Features.BookAppointment;

public class BookAppointmentCommandHandler(
    AppointmentsDbContext appointmentsDbContext,
    ILogger<BookAppointmentCommandHandler> logger) : ICommandHandler<BookAppointmentCommand>
{
    public async Task<Result> Handle(BookAppointmentCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Booking appointment for patient {PatientUserId} with professional {ProfessionalId} on {StartDate} - {EndDate}",
            command.PatientId, command.ProfessionalId, command.StartDate, command.EndDate);

        var appointment = new Appointment(
            command.PatientId,
            command.ProfessionalId,
            command.StartDate,
            command.EndDate,
            command.Price,
            command.Urgency,
            command.Notes);

        appointmentsDbContext.Appointments.Add(appointment);
        await appointmentsDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Appointment scheduled with ID {AppointmentId}", appointment.Id);
        return Result.Success();
    }
}