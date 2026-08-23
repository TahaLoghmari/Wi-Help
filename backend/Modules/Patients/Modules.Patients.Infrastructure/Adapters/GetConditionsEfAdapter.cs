using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetConditionsEfAdapter(PatientsDbContext dbContext) : IGetConditionsPort
{
    public Task<List<Condition>> GetAllAsync(CancellationToken cancellationToken) =>
        dbContext.Conditions
            .AsNoTracking()
            .OrderBy(condition => condition.Key)
            .ToListAsync(cancellationToken);
}
