using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.GetRelationships;

internal sealed class GetRelationships : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetRelationships, async (
                IQueryHandler<GetRelationshipsQuery, List<RelationshipDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetRelationshipsQuery();
                Result<List<RelationshipDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Patients);
    }
}
