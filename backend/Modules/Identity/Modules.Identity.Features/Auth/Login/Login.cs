using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.Auth.Login;

internal sealed class Login: IEndpoint
{
    
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/auth/login", async (
                Request request,
                ICommandHandler<LoginCommand> handler,
                CancellationToken cancellationToken) =>
            {
                LoginCommand command = new LoginCommand(request.Email, request.Password);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    () => Results.Ok(),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }
    private sealed record Request(
        string Email,
        string Password);
}
