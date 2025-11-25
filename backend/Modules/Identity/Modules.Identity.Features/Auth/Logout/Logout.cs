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
        app.MapPost(IdentityEndpoints.Logout, (
                HttpContext context,
                CookieService cookieService,
                CancellationToken cancellationToken) =>
            {
                cookieService.RemoveCookies(context.Response);
                return Results.Ok();
            })
            .WithTags(Tags.Authentication);
    }
}