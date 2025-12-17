using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.GetPatientReviewStats;

internal sealed class GetPatientReviewStats : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetPatientReviewStats, async (
                Guid patientId,
                IQueryHandler<GetPatientReviewStatsQuery, GetPatientReviewStatsDto> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetPatientReviewStatsQuery(patientId);
                Result<GetPatientReviewStatsDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }
}
