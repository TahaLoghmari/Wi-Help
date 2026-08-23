using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Adapters;

public sealed class PatientCatalogOperations(PatientsDbContext dbContext) : IPatientCatalogOperations
{
    public Task<List<Allergy>> GetAllergiesAsync(CancellationToken cancellationToken) =>
        dbContext.Allergies.AsNoTracking().OrderBy(allergy => allergy.Key).ToListAsync(cancellationToken);

    public Task<List<Condition>> GetConditionsAsync(CancellationToken cancellationToken) =>
        dbContext.Conditions.AsNoTracking().OrderBy(condition => condition.Key).ToListAsync(cancellationToken);

    public Task<List<Medication>> GetMedicationsAsync(CancellationToken cancellationToken) =>
        dbContext.Medications.AsNoTracking().OrderBy(medication => medication.Key).ToListAsync(cancellationToken);

    public Task<List<Relationship>> GetRelationshipsAsync(CancellationToken cancellationToken) =>
        dbContext.Relationships.AsNoTracking().OrderBy(relationship => relationship.Key).ToListAsync(cancellationToken);
}
