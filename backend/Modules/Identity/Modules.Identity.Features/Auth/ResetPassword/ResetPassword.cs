using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.Auth.ResetPassword;

internal sealed class ResetPassword : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.ResetPassword, async (
                Request request,
                ICommandHandler<ResetPasswordCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new ResetPasswordCommand(
                    request.Email,
                    request.Token,
                    request.NewPassword,
                    request.ConfirmPassword);

                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.NoContent(),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }

    private sealed record Request(
        string Email,
        string Token,
        string NewPassword,
        string ConfirmPassword);
}
