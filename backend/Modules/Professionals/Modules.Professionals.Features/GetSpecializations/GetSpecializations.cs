using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.GetSpecializations;

internal sealed class GetSpecializations : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetSpecializations, async (
                IQueryHandler<GetSpecializationsQuery, List<SpecializationDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetSpecializationsQuery();
                Result<List<SpecializationDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals);
    }
}
