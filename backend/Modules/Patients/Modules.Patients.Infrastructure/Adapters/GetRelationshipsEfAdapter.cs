using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetRelationshipsEfAdapter(PatientsDbContext dbContext) : IGetRelationshipsPort
{
    public Task<List<Relationship>> GetAllAsync(CancellationToken cancellationToken) =>
        dbContext.Relationships
            .AsNoTracking()
            .OrderBy(relationship => relationship.Key)
            .ToListAsync(cancellationToken);
}
