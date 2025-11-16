using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.Auth.ConfirmEmail;

internal sealed class ConfirmEmail: IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.ConfirmEmail, async (
                [FromQuery] string userId,
                [FromQuery] string token,
                ICommandHandler<ConfirmEmailCommand> handler,
                IConfiguration configuration,
                CancellationToken cancellationToken) =>
            {
                ConfirmEmailCommand command = new ConfirmEmailCommand(userId, token);
                Result result = await handler.Handle(command, cancellationToken);
                
                var frontendUrl = configuration["FRONTEND_URL"];
                
                return result.Match(
                    () => Results.Redirect($"{frontendUrl}/auth/email-verified?status=success"),
                    _ => Results.Redirect($"{frontendUrl}/auth/email-verified?status=failure"));
            })
            .WithTags(Tags.Authentication)
            .AllowAnonymous();
    }
}
