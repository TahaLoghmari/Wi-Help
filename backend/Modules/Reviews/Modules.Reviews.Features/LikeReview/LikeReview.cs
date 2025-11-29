using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.LikeReview;

public class LikeReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ReviewsEndpoints.LikeReview, async (
                Guid reviewId,
                HttpContext httpContext,
                ICommandHandler<LikeReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var currentUserIdString = httpContext.User.FindFirst("sub")?.Value ??
                                         httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(currentUserIdString) || !Guid.TryParse(currentUserIdString, out Guid currentUserId))
                {
                    return Results.Unauthorized();
                }

                var command = new LikeReviewCommand(reviewId, currentUserId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }
}

