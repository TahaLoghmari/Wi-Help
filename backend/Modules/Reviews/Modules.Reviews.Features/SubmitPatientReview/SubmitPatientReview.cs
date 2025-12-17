using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.SubmitPatientReview;

public class SubmitPatientReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ReviewsEndpoints.SubmitPatientReview, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<SubmitPatientReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var professionalIdString = httpContext.User.FindFirst("ProfessionalId")?.Value;
                if (!Guid.TryParse(professionalIdString, out Guid professionalId))
                {
                    return Results.Unauthorized();
                }

                var command = new SubmitPatientReviewCommand(
                    professionalId,
                    request.PatientId,
                    request.Comment,
                    request.Rating);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Professional" });
    }

    private sealed record Request(
        Guid PatientId,
        string Comment,
        int Rating);
}
