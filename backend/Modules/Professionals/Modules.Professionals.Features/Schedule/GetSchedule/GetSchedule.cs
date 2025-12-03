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
                Guid professionalId,
                IQueryHandler<GetScheduleQuery, GetScheduleDto> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetScheduleQuery(professionalId);
                var result = await handler.Handle(query, cancellationToken);
                return result.Match(
                    schedule => Results.Ok(schedule),
                    CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.Professionals);
    }
}

