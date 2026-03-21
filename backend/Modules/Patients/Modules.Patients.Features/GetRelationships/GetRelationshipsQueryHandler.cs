using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetRelationships;

public sealed class GetRelationshipsQueryHandler(
    PatientsDbContext dbContext,
    ILogger<GetRelationshipsQueryHandler> logger) : IQueryHandler<GetRelationshipsQuery, List<RelationshipDto>>
{
    public async Task<Result<List<RelationshipDto>>> Handle(
        GetRelationshipsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all relationships");

        var relationships = await dbContext.Relationships
            .AsNoTracking()
            .OrderBy(r => r.Key)
            .Select(r => new RelationshipDto(r.Id, r.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} relationships", relationships.Count);

        return Result<List<RelationshipDto>>.Success(relationships);
    }
}
