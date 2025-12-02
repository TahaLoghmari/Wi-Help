using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Educations.DeleteEducation;

internal sealed class DeleteEducation : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ProfessionalsEndpoints.DeleteEducation, async (
                [FromRoute] Guid educationId,
                HttpContext httpContext,
                ICommandHandler<DeleteEducationCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new DeleteEducationCommand(professionalId, educationId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
