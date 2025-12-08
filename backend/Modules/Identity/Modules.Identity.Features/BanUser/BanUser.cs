using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.BanUser;

internal sealed class BanUser : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(IdentityEndpoints.BanUser, async (
                Guid userId,
                [AsParameters] Request request,
                ICommandHandler<BanUserCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new BanUserCommand(userId, request.IsBanned);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithTags(Tags.Authentication)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(bool IsBanned);
}
