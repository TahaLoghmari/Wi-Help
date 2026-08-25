using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class PatientOnboardingOperations(PatientsDbContext dbContext) : IPatientOnboardingOperations
{
    public Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken) =>
        dbContext.Relationships.AsNoTracking().AnyAsync(relationship => relationship.Id == relationshipId, cancellationToken);

    public Task<bool> PatientExistsAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients.AnyAsync(patient => patient.UserId == userId, cancellationToken);

    public Task<Patient?> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients.FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);

    public Task AddPatientAsync(Patient patient, CancellationToken cancellationToken)
    {
        dbContext.Patients.Add(patient);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
