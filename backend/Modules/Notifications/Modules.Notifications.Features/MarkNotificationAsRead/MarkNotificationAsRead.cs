using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Notifications.Features.MarkNotificationAsRead;

public class MarkNotificationAsRead : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(NotificationsEndpoints.MarkNotificationAsRead, async (
                Guid id,
                HttpContext httpContext,
                ICommandHandler<MarkNotificationAsReadCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId is null)
                {
                    return Results.Unauthorized();
                }

                var command = new MarkNotificationAsReadCommand(id, userId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Notifications)
            .RequireAuthorization();
    }
}