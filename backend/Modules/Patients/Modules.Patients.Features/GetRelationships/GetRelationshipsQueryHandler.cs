using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Domain.Repositories;

namespace Modules.Patients.Features.GetRelationships;

public sealed class GetRelationshipsQueryHandler(
    IPatientCatalogRepository catalogRepository,
    ILogger<GetRelationshipsQueryHandler> logger) : IQueryHandler<GetRelationshipsQuery, List<RelationshipDto>>
{
    public async Task<Result<List<RelationshipDto>>> Handle(
        GetRelationshipsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all relationships");

        var relationships = (await catalogRepository.GetRelationshipsAsync(cancellationToken))
            .Select(relationship => new RelationshipDto(relationship.Id, relationship.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} relationships", relationships.Count);

        return Result<List<RelationshipDto>>.Success(relationships);
    }
}
