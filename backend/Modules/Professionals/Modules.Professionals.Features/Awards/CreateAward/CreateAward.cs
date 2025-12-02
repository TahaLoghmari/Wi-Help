using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Awards.CreateAward;

internal sealed class CreateAward : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.CreateAward, async (
                [FromBody] Request request,
                HttpContext httpContext,
                ICommandHandler<CreateAwardCommand, AwardDto> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new CreateAwardCommand(
                    professionalId,
                    request.Title,
                    request.Issuer,
                    request.Description,
                    request.YearReceived);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    dto => Results.Created($"{ProfessionalsEndpoints.GetAwards}/{dto.Id}", dto),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request(
        string Title,
        string? Issuer,
        string? Description,
        string YearReceived);
}
