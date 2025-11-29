using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.GetProfessionalReviewStats;

internal sealed class GetProfessionalReviewStats : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ReviewsEndpoints.GetProfessionalReviewStats, async (
                Guid professionalId,
                IQueryHandler<GetProfessionalReviewStatsQuery, GetProfessionalReviewStatsDto> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetProfessionalReviewStatsQuery(professionalId);
                Result<GetProfessionalReviewStatsDto> result =
                    await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Reviews)
            .RequireAuthorization();
    }
}

