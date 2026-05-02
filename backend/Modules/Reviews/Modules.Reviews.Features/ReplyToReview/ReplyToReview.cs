using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.ReplyToReview;

internal sealed class ReplyToReview : IEndpoint
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
                var userIdString = httpContext.User.FindFirst("sub")?.Value
                                   ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdString, out var userId))
                    return Results.Unauthorized();

                var patientId = Guid.TryParse(
                    httpContext.User.FindFirst("PatientId")?.Value, out var pid) ? pid : (Guid?)null;
                var professionalId = Guid.TryParse(
                    httpContext.User.FindFirst("ProfessionalId")?.Value, out var proId) ? proId : (Guid?)null;

                var command = new ReplyToReviewCommand(
                    reviewId, userId, patientId, professionalId, request.Comment);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request(string Comment);
}
