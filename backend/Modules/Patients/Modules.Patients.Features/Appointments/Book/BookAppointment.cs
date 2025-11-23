using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Modules.Appointments.PublicApi;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

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
    ILogger<BookAppointmentCommandHandler> logger) : ICommandHandler<BookAppointmentCommand>
{
    public async Task<Result> Handle(BookAppointmentCommand command, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation(
                "Booking appointment for patient {PatientId} with professional {ProfessionalId} on {StartDate} - {EndDate}",
                command.UserId, command.ProfessionalId, command.StartDate, command.EndDate);

            var result = await appointmentsModuleApi.ScheduleAppointmentAsync(
                command.UserId,
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