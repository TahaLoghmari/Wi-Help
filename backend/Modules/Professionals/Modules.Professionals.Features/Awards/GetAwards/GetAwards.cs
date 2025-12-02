using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.Awards.GetAwards;

internal sealed class GetAwards : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetAwards, async (
                HttpContext httpContext,
                IQueryHandler<GetAwardsQuery, List<AwardDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;

                if (!Guid.TryParse(professionalIdString, out var professionalId))
                {
                    return Results.Unauthorized();
                }

                var query = new GetAwardsQuery(professionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    awards => Results.Ok(awards),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }
}
