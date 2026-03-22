using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.Logout;

public class Logout : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.Logout, async (
                HttpContext context,
                CookieService cookieService,
                TokenManagementService tokenManagementService,
                CancellationToken cancellationToken) =>
            {
                string? refreshTokenValue = context.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshTokenValue))
                {
                    var body = await context.Request.ReadFromJsonAsync<LogoutRequest>(cancellationToken);
                    refreshTokenValue = body?.RefreshToken;
                }
                if (!string.IsNullOrEmpty(refreshTokenValue))
                {
                    await tokenManagementService.RemoveRefreshToken(refreshTokenValue, cancellationToken);
                }
                cookieService.RemoveCookies(context.Response);
                return Results.Ok();
            })
            .WithTags(Tags.Authentication);
    }

    private sealed record LogoutRequest(string? RefreshToken);
}