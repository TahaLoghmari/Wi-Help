using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Infrastructure.DTOs;

namespace Modules.Identity.Features.Auth.GetCurrentUser;

internal sealed class GetCurrentUser : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.GetCurrentUser, async (
                IQueryHandler<GetCurrentUserQuery, GetCurrentUserDto> handler,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                GetCurrentUserQuery query = new GetCurrentUserQuery(userId);
                Result<GetCurrentUserDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    userDto => Results.Ok(userDto),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Authentication)
            .RequireAuthorization();
    }
}