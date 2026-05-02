using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain.Enums;

namespace Modules.Reviews.Features.SubmitReview;

internal sealed class SubmitReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ReviewsEndpoints.SubmitReview, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<SubmitReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientId = Guid.TryParse(
                    httpContext.User.FindFirst("PatientId")?.Value, out var pid) ? pid : (Guid?)null;
                var professionalId = Guid.TryParse(
                    httpContext.User.FindFirst("ProfessionalId")?.Value, out var proId) ? proId : (Guid?)null;

                if (!patientId.HasValue && !professionalId.HasValue)
                    return Results.Unauthorized();

                Guid reviewPatientId, reviewProfessionalId;
                ReviewType type;

                if (patientId.HasValue)
                {
                    reviewPatientId = patientId.Value;
                    reviewProfessionalId = request.SubjectId;
                    type = ReviewType.ProfessionalReview;
                }
                else
                {
                    reviewProfessionalId = professionalId!.Value;
                    reviewPatientId = request.SubjectId;
                    type = ReviewType.PatientReview;
                }

                var command = new SubmitReviewCommand(
                    reviewPatientId,
                    reviewProfessionalId,
                    request.Comment,
                    request.Rating,
                    type);

                var result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request(Guid SubjectId, string Comment, int Rating);
}
