using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Awards.DeleteAward;

internal sealed class DeleteAward : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ProfessionalsEndpoints.DeleteAward, async (
                [FromRoute] Guid awardId,
                HttpContext httpContext,
                ICommandHandler<DeleteAwardCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new DeleteAwardCommand(professionalId, awardId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
