using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.Auth.ForgotPassword;

internal sealed class ForgotPassword : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.ForgotPassword, async (
                Request request,
                ICommandHandler<ForgotPasswordCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new ForgotPasswordCommand(request.Email);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }

    private sealed record Request(string Email);
}
