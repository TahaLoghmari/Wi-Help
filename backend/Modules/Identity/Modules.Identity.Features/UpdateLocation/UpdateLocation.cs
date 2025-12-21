using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.UpdateLocation;

/// <summary>
/// Endpoint for updating user location via browser geolocation.
/// PATCH /users/location - authenticated users only.
/// </summary>
internal sealed class UpdateLocation : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(IdentityEndpoints.UpdateLocation, async (
                UpdateLocationRequest request,
                ICommandHandler<UpdateLocationCommand> handler,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst("sub")?.Value 
                    ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Results.Unauthorized();
                }

                var command = new UpdateLocationCommand(
                    userId,
                    request.Latitude,
                    request.Longitude,
                    request.Accuracy,
                    request.Timestamp);

                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication)
            .RequireAuthorization();
    }
}
