using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Features.DTOs;

namespace Modules.Identity.Features.Auth.Login;

internal sealed class Login: IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.Login, async (
                Request request,
                ICommandHandler<LoginCommand, AccessTokensDto> handler,
                CookieService cookieService,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                LoginCommand command = new LoginCommand(request.Email, request.Password);
                Result<AccessTokensDto> result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    tokens =>
                    {
                        cookieService.AddCookies(httpContext.Response, tokens);
                        return Results.Ok();
                    },
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }
    private sealed record Request(
        string Email,
        string Password);
}
