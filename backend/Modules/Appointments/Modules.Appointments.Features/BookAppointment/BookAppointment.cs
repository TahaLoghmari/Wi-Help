using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Appointments.Domain.Enums;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.BookAppointment;

public class BookAppointment : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(AppointmentsEndpoints.BookAppointment, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<BookAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;
                if (!Guid.TryParse(patientIdString, out Guid patientId))
                {
                    return Results.Unauthorized();
                }

                var command = new BookAppointmentCommand(
                    patientId, request.ProfessionalId, request.StartDate, request.EndDate, request.Price,
                    request.Urgency, request.Notes
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization();
    }

    private sealed record Request(
        Guid ProfessionalId,
        DateTime StartDate,
        DateTime EndDate,
        decimal Price,
        AppointmentUrgency Urgency,
        string? Notes);
}