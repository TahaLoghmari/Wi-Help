using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Features.DTOs;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.Refresh;

internal sealed class Refresh : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.Refresh, async (
                ICommandHandler<RefreshCommand, AccessTokensDto> handler,
                CookieService cookieService,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshTokenValue = httpContext.Request.Cookies["refreshToken"];

                RefreshCommand command = new RefreshCommand(refreshTokenValue);
                Result<AccessTokensDto> result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    tokens =>
                    {
                        cookieService.AddCookies(httpContext.Response, tokens);
                        return Results.NoContent();
                    },
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication);
    }
}