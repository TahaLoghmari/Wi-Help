using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetCurrentPatientEfAdapter(PatientsDbContext dbContext) : IGetCurrentPatientPort
{
    public Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients
            .Include(patient => patient.Allergies)
            .Include(patient => patient.Conditions)
            .Include(patient => patient.Medications)
            .FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);
}
