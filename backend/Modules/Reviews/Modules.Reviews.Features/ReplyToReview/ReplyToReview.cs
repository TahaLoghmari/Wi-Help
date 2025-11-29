using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.ReplyToReview;

public class ReplyToReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ReviewsEndpoints.ReplyToReview, async (
                Guid reviewId,
                Request request,
                HttpContext httpContext,
                ICommandHandler<ReplyToReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ??
                                         httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(currentUserIdString) || !Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var command = new ReplyToReviewCommand(
                    reviewId,
                    currentUserId,
                    request.Comment);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request(string Comment);
}

