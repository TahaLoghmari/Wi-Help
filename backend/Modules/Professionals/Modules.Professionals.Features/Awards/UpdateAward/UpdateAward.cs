using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Awards.UpdateAward;

internal sealed class UpdateAward : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateAward, async (
                [FromRoute] Guid awardId,
                [FromBody] Request request,
                HttpContext httpContext,
                ICommandHandler<UpdateAwardCommand, AwardDto> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new UpdateAwardCommand(
                    professionalId,
                    awardId,
                    request.Title,
                    request.Issuer,
                    request.Description,
                    request.YearReceived);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    dto => Results.Ok(dto),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request(
        string? Title,
        string? Issuer,
        string? Description,
        string? YearReceived);
}
