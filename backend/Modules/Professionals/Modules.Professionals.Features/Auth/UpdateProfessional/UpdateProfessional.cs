using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

internal sealed class UpdateProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateProfessional, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<UpdateProfessionalCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                UpdateProfessionalCommand command = new UpdateProfessionalCommand(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.Address,
                    request.Specialization,
                    request.Services,
                    request.Experience,
                    request.StartPrice,
                    request.EndPrice,
                    request.Bio);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request(
        string? FirstName,
        string? LastName,
        string? PhoneNumber,
        Address? Address,
        string? Specialization,
        List<string>? Services,
        int? Experience,
        int? StartPrice,
        int? EndPrice,
        string? Bio);
}
