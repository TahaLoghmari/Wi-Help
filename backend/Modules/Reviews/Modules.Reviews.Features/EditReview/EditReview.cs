using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.EditReview;

public class EditReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ReviewsEndpoints.EditReview, async (
                Guid reviewId,
                Request request,
                HttpContext httpContext,
                ICommandHandler<EditReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;
                if (!Guid.TryParse(patientIdString, out Guid patientId))
                {
                    return Results.Unauthorized();
                }

                var command = new EditReviewCommand(
                    reviewId,
                    patientId,
                    request.Comment,
                    request.Rating);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }

    private sealed record Request(
        string Comment,
        int Rating);
}
