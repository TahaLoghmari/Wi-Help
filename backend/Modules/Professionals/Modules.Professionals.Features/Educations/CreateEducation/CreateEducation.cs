using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Educations.CreateEducation;

internal sealed class CreateEducation : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.CreateEducation, async (
                [FromBody] Request request,
                HttpContext httpContext,
                ICommandHandler<CreateEducationCommand, EducationDto> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new CreateEducationCommand(
                    professionalId,
                    request.Institution,
                    request.Degree,
                    request.FieldOfStudy,
                    request.Country,
                    request.StartYear,
                    request.EndYear,
                    request.IsCurrentlyStudying);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    dto => Results.Created($"{ProfessionalsEndpoints.GetEducations}/{dto.Id}", dto),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request(
        string Institution,
        string Degree,
        string? FieldOfStudy,
        string? Country,
        string StartYear,
        string? EndYear,
        bool IsCurrentlyStudying = false);
}
