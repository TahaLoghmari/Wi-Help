using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Messaging.Features.DeleteMessage;

public class DeleteMessage : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(MessagingEndpoints.DeleteMessage, async (
                Guid messageId,
                HttpContext httpContext,
                ICommandHandler<DeleteMessageCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value;
                if (!Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var command = new DeleteMessageCommand(
                    messageId,
                    currentUserId
                );

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags("Messaging")
            .RequireAuthorization();
    }
}

