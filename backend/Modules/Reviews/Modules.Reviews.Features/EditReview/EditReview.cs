using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.EditReview;

internal sealed class EditReview : IEndpoint
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
                var patientId = Guid.TryParse(
                    httpContext.User.FindFirst("PatientId")?.Value, out var pid) ? pid : (Guid?)null;
                var professionalId = Guid.TryParse(
                    httpContext.User.FindFirst("ProfessionalId")?.Value, out var proId) ? proId : (Guid?)null;
                bool isAdmin = httpContext.User.IsInRole("Admin");

                if (!patientId.HasValue && !professionalId.HasValue && !isAdmin)
                    return Results.Unauthorized();

                var command = new EditReviewCommand(
                    reviewId,
                    patientId,
                    professionalId,
                    isAdmin,
                    request.Comment,
                    request.Rating);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request(string Comment, int Rating);
}
