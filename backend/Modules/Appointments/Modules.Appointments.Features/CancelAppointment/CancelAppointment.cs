using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.CancelAppointment;

public class CancelAppointment : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(AppointmentsEndpoints.CancelAppointment, async (
                Guid appointmentId,
                HttpContext httpContext,
                ICommandHandler<CancelAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;
                if (!Guid.TryParse(patientIdString, out Guid patientId))
                {
                    return Results.Unauthorized();
                }

                var command = new CancelAppointmentCommand(appointmentId, patientId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }
}
