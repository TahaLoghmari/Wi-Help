using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.DeleteReply;

internal sealed class DeleteReply : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ReviewsEndpoints.DeleteReply, async (
                Guid reviewId,
                Guid replyId,
                HttpContext httpContext,
                ICommandHandler<DeleteReplyCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value
                                   ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdString, out var userId))
                    return Results.Unauthorized();

                bool isAdmin = httpContext.User.IsInRole("Admin");

                var command = new DeleteReplyCommand(reviewId, replyId, userId, isAdmin);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }
}
