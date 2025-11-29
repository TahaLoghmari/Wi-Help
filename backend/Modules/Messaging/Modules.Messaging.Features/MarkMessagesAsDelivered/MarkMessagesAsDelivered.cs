using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Messaging.Features.MarkMessagesAsDelivered;

public class MarkMessagesAsDelivered : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(MessagingEndpoints.MarkMessagesAsDelivered, async (
                Guid conversationId,
                HttpContext httpContext,
                ICommandHandler<MarkMessagesAsDeliveredCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ?? 
                                         httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(currentUserIdString) || !Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var command = new MarkMessagesAsDeliveredCommand(
                    conversationId,
                    currentUserId
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }
}

