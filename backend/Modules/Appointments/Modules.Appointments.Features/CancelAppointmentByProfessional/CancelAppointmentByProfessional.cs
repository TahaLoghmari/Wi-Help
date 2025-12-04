using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.CancelAppointmentByProfessional;

public class CancelAppointmentByProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(AppointmentsEndpoints.CancelAppointmentByProfessional, async (
                Guid appointmentId,
                HttpContext httpContext,
                ICommandHandler<CancelAppointmentByProfessionalCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                if (!Guid.TryParse(professionalIdString, out Guid professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new CancelAppointmentByProfessionalCommand(appointmentId, professionalId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
