using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.Auth.ChangePassword;

internal sealed class ChangePassword : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.ChangePassword, async (
                Request request,
                ICommandHandler<ChangePasswordCommand> handler,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ??
                                   httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                ChangePasswordCommand command = new ChangePasswordCommand(
                    userId,
                    request.CurrentPassword,
                    request.NewPassword);
                    
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    error => CustomResults.Problem(error));
            })
            .RequireAuthorization()
            .WithTags(Tags.Authentication);
    }

    private sealed record Request(
        string CurrentPassword,
        string NewPassword);
}
