using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Experiences.UpdateExperience;

internal sealed class UpdateExperience : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateExperience, async (
                [FromRoute] Guid experienceId,
                [FromBody] Request request,
                HttpContext httpContext,
                ICommandHandler<UpdateExperienceCommand, ExperienceDto> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new UpdateExperienceCommand(
                    professionalId,
                    experienceId,
                    request.Title,
                    request.Organization,
                    request.Location,
                    request.Description,
                    request.StartYear,
                    request.EndYear,
                    request.IsCurrentPosition);

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
        string? Organization,
        string? Location,
        string? Description,
        string? StartYear,
        string? EndYear,
        bool? IsCurrentPosition);
}
