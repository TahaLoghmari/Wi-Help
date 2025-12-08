using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.AdminChangePassword;

internal sealed class AdminChangePassword : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(IdentityEndpoints.AdminChangePassword, async (
                Guid userId,
                [AsParameters] Request request,
                ICommandHandler<AdminChangePasswordCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new AdminChangePasswordCommand(userId, request.NewPassword);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithTags(Tags.Authentication)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(string NewPassword);
}
