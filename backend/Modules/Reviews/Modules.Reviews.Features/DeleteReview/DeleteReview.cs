using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.DeleteReview;

public class DeleteReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ReviewsEndpoints.DeleteReview, async (
                Guid reviewId,
                HttpContext httpContext,
                ICommandHandler<DeleteReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;
                if (!Guid.TryParse(patientIdString, out Guid patientId))
                {
                    return Results.Unauthorized();
                }

                var command = new DeleteReviewCommand(reviewId, patientId);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }
}
