using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.CompleteAppointment;

public class CompleteAppointment : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(AppointmentsEndpoints.CompleteAppointment, async (
                [FromRoute] Guid appointmentId,
                [FromForm] IFormFile prescriptionPdf,
                [FromForm] string? prescriptionTitle,
                [FromForm] string? prescriptionNotes,
                HttpContext httpContext,
                ICommandHandler<CompleteAppointmentCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                if (!Guid.TryParse(professionalIdString, out Guid professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new CompleteAppointmentCommand(
                    appointmentId,
                    professionalId,
                    prescriptionPdf,
                    prescriptionTitle,
                    prescriptionNotes);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" })
            .DisableAntiforgery();
    }
}
