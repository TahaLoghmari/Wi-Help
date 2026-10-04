using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.DTOs;
using Modules.Identity.Domain.Services;

namespace Modules.Identity.Features.Auth.Refresh;

internal sealed class Refresh : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.Refresh, async (
                ICommandHandler<RefreshCommand, AccessTokensDto> handler,
                IAuthCookies authCookies,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                string? refreshTokenValue = httpContext.Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshTokenValue))
                {
                    var body = await httpContext.Request.ReadFromJsonAsync<RefreshRequest>(cancellationToken);
                    refreshTokenValue = body?.RefreshToken;
                }

                RefreshCommand command = new RefreshCommand(refreshTokenValue);
                Result<AccessTokensDto> result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    tokens =>
                    {
                        authCookies.AddCookies(httpContext.Response, tokens);
                        return Results.Ok(new { tokens.AccessToken, tokens.RefreshToken });
                    },
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }

    private sealed record RefreshRequest(string? RefreshToken);
}
