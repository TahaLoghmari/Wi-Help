using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.Auth.UpdateUser;

internal sealed class UpdateUser : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(IdentityEndpoints.UpdateUser, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<UpdateUserCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }
                
                UpdateUserCommand command = new UpdateUserCommand(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.Address,
                    request.EmergencyContact,
                    request.Specialization,
                    request.Services,
                    request.Experience,
                    request.StartPrice,
                    request.EndPrice,
                    request.Bio);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Authentication)
            .RequireAuthorization();
    }

    private sealed record Request(
        string? FirstName,
        string? LastName,
        string? PhoneNumber,
        Address? Address,
        EmergencyContact? EmergencyContact,
        string? Specialization,
        List<string>? Services,
        int? Experience,
        int? StartPrice,
        int? EndPrice,
        string? Bio);
}
