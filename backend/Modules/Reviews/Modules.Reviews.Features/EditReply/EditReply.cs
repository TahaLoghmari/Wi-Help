using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.EditReply;

internal sealed class EditReply : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ReviewsEndpoints.EditReply, async (
                Guid reviewId,
                Guid replyId,
                Request request,
                HttpContext httpContext,
                ICommandHandler<EditReplyCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value
                                   ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdString, out var userId))
                    return Results.Unauthorized();

                bool isAdmin = httpContext.User.IsInRole("Admin");

                var command = new EditReplyCommand(reviewId, replyId, userId, isAdmin, request.Comment);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request(string Comment);
}
