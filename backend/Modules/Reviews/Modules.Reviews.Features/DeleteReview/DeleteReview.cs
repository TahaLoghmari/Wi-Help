using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.DeleteReview;

internal sealed class DeleteReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ReviewsEndpoints.DeleteReview, async (
                Guid reviewId,
                HttpContext httpContext,
                ICommandHandler<DeleteReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientId = Guid.TryParse(
                    httpContext.User.FindFirst("PatientId")?.Value, out var pid) ? pid : (Guid?)null;
                var professionalId = Guid.TryParse(
                    httpContext.User.FindFirst("ProfessionalId")?.Value, out var proId) ? proId : (Guid?)null;
                bool isAdmin = httpContext.User.IsInRole("Admin");

                if (!patientId.HasValue && !professionalId.HasValue && !isAdmin)
                    return Results.Unauthorized();

                var command = new DeleteReviewCommand(reviewId, patientId, professionalId, isAdmin);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }
}
