using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.RespondToAppointment;

public class RespondToAppointment : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(AppointmentsEndpoints.RespondToAppointment, async (
                [FromRoute] Guid appointmentId,
                [FromBody] Request request,
                HttpContext httpContext,
                ICommandHandler<RespondToAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                if (!Guid.TryParse(professionalIdString, out Guid professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new RespondToAppointmentCommand(
                    appointmentId,
                    professionalId,
                    request.IsAccepted
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
    private class Request
    {
        public bool IsAccepted { get; init; }
    }
}