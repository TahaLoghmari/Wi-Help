using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class GetPatientEfAdapter(PatientsDbContext dbContext) : IGetPatientPort
{
    public Task<Patient?> GetByIdAsync(Guid patientId, CancellationToken cancellationToken) =>
        dbContext.Patients
            .Include(patient => patient.Allergies)
            .Include(patient => patient.Conditions)
            .Include(patient => patient.Medications)
            .FirstOrDefaultAsync(patient => patient.Id == patientId, cancellationToken);
}
