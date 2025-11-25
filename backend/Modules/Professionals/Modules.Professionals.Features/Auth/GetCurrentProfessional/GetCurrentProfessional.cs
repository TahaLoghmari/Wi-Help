using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

internal sealed class GetCurrentProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetCurrentProfessional, async (
                HttpContext httpContext,
                IQueryHandler<GetCurrentProfessionalQuery, GetCurrentProfessionalDto> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? 
                                   httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrWhiteSpace(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Results.Unauthorized();
                }

                GetCurrentProfessionalQuery query = new GetCurrentProfessionalQuery(userId);
                Result<GetCurrentProfessionalDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    profileDto => Results.Ok(profileDto),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
