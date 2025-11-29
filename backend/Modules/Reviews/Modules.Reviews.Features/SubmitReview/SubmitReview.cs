using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.SubmitReview;

public class SubmitReview : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ReviewsEndpoints.SubmitReview, async (
                Request request,
                HttpContext httpContext,
                ICommandHandler<SubmitReviewCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var patientIdString = httpContext.User.FindFirst("PatientId")?.Value;
                if (!Guid.TryParse(patientIdString, out Guid patientId))
                {
                    return Results.Unauthorized();
                }

                var command = new SubmitReviewCommand(
                    patientId,
                    request.ProfessionalId,
                    request.Comment,
                    request.Rating);

                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }

    private sealed record Request(
        Guid ProfessionalId,
        string Comment,
        int Rating);
}

