using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetAllPatientsEfAdapter(PatientsDbContext dbContext) : IGetAllPatientsPort
{
    public async Task<(List<Patient> Patients, int TotalCount)> GetPageAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Patients.CountAsync(cancellationToken);
        var patients = await dbContext.Patients
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (patients, totalCount);
    }
}
