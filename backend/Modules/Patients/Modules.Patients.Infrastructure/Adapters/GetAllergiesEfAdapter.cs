using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetAllergiesEfAdapter(PatientsDbContext dbContext) : IGetAllergiesPort
{
    public Task<List<Allergy>> GetAllAsync(CancellationToken cancellationToken) =>
        dbContext.Allergies
            .AsNoTracking()
            .OrderBy(allergy => allergy.Key)
            .ToListAsync(cancellationToken);
}
