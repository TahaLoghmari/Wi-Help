using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public class GetSchedule : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetSchedule, async (
                HttpContext httpContext,
                IQueryHandler<GetScheduleQuery, ScheduleDto> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (!Guid.TryParse(userIdString, out var userIdGuid))
                {
                    return CustomResults.Problem(
                        Error.Unauthorized(
                            "GetSchedule.Unauthorized",
                            "User ID claim is missing or invalid."));
                }
                var query = new GetScheduleQuery(userIdGuid);
                var result = await handler.Handle(query, cancellationToken);
                return result.Match(
                    schedule => Results.Ok(schedule),
                    CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }
}

