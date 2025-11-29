using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Notifications.Features.GetNotifications;

public class GetNotifications : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(NotificationsEndpoints.GetNotifications, async (
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetNotificationsQuery, PaginationResultDto<GetNotificationsDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId is null)
                {
                    return Results.Unauthorized();
                }

                var query = new GetNotificationsQuery(userId, request.Page , request.PageSize);

                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    success => Results.Ok(success),
                    failure => CustomResults.Problem(failure));
            })
            .WithTags(Tags.Notifications)
            .RequireAuthorization();
    }

    private class Request
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}