using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.Appointments.Book;

public class BookAppointment : IEndpoint

{
    public sealed record Request(
        Guid ProfessionalId,
        DateTime StartDate,
        DateTime EndDate,
        decimal Price,
        string TimeZoneId,
        string Notes);

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(PatientsEndpoints.BookAppointment, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<BookAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst("sub")?.Value ??
                             httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userId, out Guid userIdGuid))
                {
                    return Results.Unauthorized();
                }

                var query = new BookAppointmentCommand(
                    userIdGuid, request.ProfessionalId, request.StartDate, request.EndDate, request.Price,
                    request.TimeZoneId, request.Notes
                );

                var result = await handler.Handle(query, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags("Patients");
    }
}

public record BookAppointmentCommand(
    Guid UserId,
    Guid ProfessionalId,
    DateTime StartDate,
    DateTime EndDate,
    decimal Price,
    string TimeZoneId,
    string Notes
) : ICommand;

public class BookAppointmentCommandHandler(
    IAppointmentsModuleApi appointmentsModuleApi,
    PatientsDbContext patientsDbContext,
    ILogger<BookAppointmentCommandHandler> logger) : ICommandHandler<BookAppointmentCommand>
{
    public async Task<Result> Handle(BookAppointmentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation(
                "Booking appointment for patient {PatientId} with professional {ProfessionalId} on {StartDate} - {EndDate}",
                command.UserId, command.ProfessionalId, command.StartDate, command.EndDate);

            var patientId =
                await patientsDbContext.Patients.FirstOrDefaultAsync(p => p.UserId == command.UserId,
                    cancellationToken);
            if (patientId == null)
            {
                logger.LogWarning("Patient with UserId {UserId} not found", command.UserId);
                return Result.Failure(
                    Error.Failure(
                        "BookAppointment.PatientNotFound",
                        "Patient not found."));
            }

            var result = await appointmentsModuleApi.ScheduleAppointmentAsync(
                patientId.Id,
                command.ProfessionalId,
                command.StartDate,
                command.EndDate,
                command.Price,
                command.TimeZoneId,
                command.Notes,
                cancellationToken);

            return result;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Booking appointment failed");
            return Result.Failure(
                Error.Failure(
                    "BookAppointment.Failed",
                    "An error occurred while booking the appointment."));
        }
    }
}