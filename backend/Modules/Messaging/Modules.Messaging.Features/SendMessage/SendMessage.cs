using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Messaging.Features.SendMessage;

public class SendMessage : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(MessagingEndpoints.SendMessage, async (
                Guid conversationId,
                Request request,
                HttpContext httpContext,
                ICommandHandler<SendMessageCommand, Guid> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ?? 
                                         httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(currentUserIdString) || !Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var command = new SendMessageCommand(
                    conversationId,
                    currentUserId,
                    request.Content
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    messageId => Results.Ok(new { MessageId = messageId }),
                    CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }

    private sealed record Request(string Content);
}

