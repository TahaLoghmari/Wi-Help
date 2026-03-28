using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.GetAppointmentById;

internal sealed class GetAppointmentById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetAppointmentById, async (
                [FromRoute] Guid appointmentId,
                HttpContext httpContext,
                IQueryHandler<GetAppointmentByIdQuery, GetAppointmentByIdDto> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                if (!Guid.TryParse(professionalIdString, out Guid professionalId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetAppointmentByIdQuery(appointmentId, professionalId);
                Result<GetAppointmentByIdDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
