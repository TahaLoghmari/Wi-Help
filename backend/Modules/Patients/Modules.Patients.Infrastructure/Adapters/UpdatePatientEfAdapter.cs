using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class UpdatePatientEfAdapter(PatientsDbContext dbContext) : IUpdatePatientPort
{
    public Task<Patient?> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients
            .Include(patient => patient.Allergies)
            .Include(patient => patient.Conditions)
            .Include(patient => patient.Medications)
            .FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);

    public Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken) =>
        dbContext.Relationships
            .AsNoTracking()
            .AnyAsync(relationship => relationship.Id == relationshipId, cancellationToken);

    public Task<List<Allergy>> GetAllergiesAsync(IEnumerable<Guid> allergyIds, CancellationToken cancellationToken) =>
        dbContext.Allergies.Where(allergy => allergyIds.Contains(allergy.Id)).ToListAsync(cancellationToken);

    public Task<List<Condition>> GetConditionsAsync(IEnumerable<Guid> conditionIds, CancellationToken cancellationToken) =>
        dbContext.Conditions.Where(condition => conditionIds.Contains(condition.Id)).ToListAsync(cancellationToken);

    public Task<List<Medication>> GetMedicationsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken) =>
        dbContext.Medications.Where(medication => medicationIds.Contains(medication.Id)).ToListAsync(cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
