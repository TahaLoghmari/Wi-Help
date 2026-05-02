using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.GetReviewStats;

internal sealed class GetReviewStats : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetReviewStats, async (
                [AsParameters] Request request,
                HttpContext httpContext,
                IQueryHandler<GetReviewStatsQuery, ReviewStatsDto> handler,
                CancellationToken cancellationToken) =>
            {
                var patientId = Guid.TryParse(
                    httpContext.User.FindFirst("PatientId")?.Value, out var pid) ? pid : (Guid?)null;
                var professionalId = Guid.TryParse(
                    httpContext.User.FindFirst("ProfessionalId")?.Value, out var proId) ? proId : (Guid?)null;

                var query = new GetReviewStatsQuery(request.SubjectId, patientId, professionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }

    private sealed record Request
    {
        public Guid? SubjectId { get; init; }
    }
}
