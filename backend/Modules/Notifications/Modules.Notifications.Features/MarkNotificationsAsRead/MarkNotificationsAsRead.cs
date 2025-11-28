using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Notifications.Features.MarkNotificationsAsRead;

public class MarkNotificationsAsRead : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(NotificationsEndpoints.MarkNotificationsAsRead, async (
                HttpContext httpContext,
                ICommandHandler<MarkNotificationsAsReadCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId is null)
                {
                    return Results.Unauthorized();
                }

                var command = new MarkNotificationsAsReadCommand(userId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Notifications)
            .RequireAuthorization();
    }
}