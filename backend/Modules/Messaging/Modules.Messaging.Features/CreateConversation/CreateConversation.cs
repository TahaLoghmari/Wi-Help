using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Messaging.Features.CreateConversation;

public class CreateConversation : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(MessagingEndpoints.CreateConversation, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<CreateConversationCommand, Guid> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value;
                if (!Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                // Ensure the current user is one of the participants
                if (currentUserId != request.Participant1Id && currentUserId != request.Participant2Id)
                {
                    return Results.Forbid();
                }

                var command = new CreateConversationCommand(
                    request.Participant1Id,
                    request.Participant2Id
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(
                    conversationId => Results.Ok(new { ConversationId = conversationId }),
                    CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }

    private sealed record Request(
        Guid Participant1Id,
        Guid Participant2Id);
}

