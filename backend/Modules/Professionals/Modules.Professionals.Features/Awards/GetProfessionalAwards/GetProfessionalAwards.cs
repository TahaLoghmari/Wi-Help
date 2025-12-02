using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Features.Awards.GetAwards;

namespace Modules.Professionals.Features.Awards.GetProfessionalAwards;

internal sealed class GetProfessionalAwards : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalAwards, async (
                [AsParameters] Request request,
                IQueryHandler<GetAwardsQuery, List<AwardDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAwardsQuery(request.ProfessionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    awards => Results.Ok(awards),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization();
    }

    private class Request
    {
        public Guid ProfessionalId { get; set; }
    }
}
