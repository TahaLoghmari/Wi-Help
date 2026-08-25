using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class PatientModuleApiEfAdapter(PatientsDbContext dbContext) : IPatientModuleApiPort
{
    public Task<List<Patient>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken) =>
        dbContext.Patients
            .AsNoTracking()
            .Where(patient => patientIds.Contains(patient.Id))
            .ToListAsync(cancellationToken);

    public Task<Patient?> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);

    public async Task<(List<Patient> Patients, int TotalCount)> GetPatientsForAdminAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var baseQuery = dbContext.Patients
            .AsNoTracking()
            .OrderBy(patient => patient.Id);

        var totalCount = await baseQuery.CountAsync(cancellationToken);
        var patients = await baseQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (patients, totalCount);
    }
}
