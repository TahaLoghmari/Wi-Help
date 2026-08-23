using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetMedicationsEfAdapter(PatientsDbContext dbContext) : IGetMedicationsPort
{
    public Task<List<Medication>> GetAllAsync(CancellationToken cancellationToken) =>
        dbContext.Medications
            .AsNoTracking()
            .OrderBy(medication => medication.Key)
            .ToListAsync(cancellationToken);
}
