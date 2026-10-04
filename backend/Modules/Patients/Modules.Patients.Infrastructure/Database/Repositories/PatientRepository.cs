using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.Repositories;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure.Database.Repositories;

public sealed class PatientRepository(PatientsDbContext dbContext) : IPatientRepository
{
    public Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
        Details().FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);

    public Task<Patient?> GetByIdAsync(Guid patientId, CancellationToken cancellationToken) =>
        Details().FirstOrDefaultAsync(patient => patient.Id == patientId, cancellationToken);

    public Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken) =>
        dbContext.Relationships.AsNoTracking().AnyAsync(relationship => relationship.Id == relationshipId, cancellationToken);

    public Task<List<Allergy>> GetAllergiesAsync(IEnumerable<Guid> allergyIds, CancellationToken cancellationToken) =>
        dbContext.Allergies.Where(allergy => allergyIds.Contains(allergy.Id)).ToListAsync(cancellationToken);

    public Task<List<Condition>> GetConditionsAsync(IEnumerable<Guid> conditionIds, CancellationToken cancellationToken) =>
        dbContext.Conditions.Where(condition => conditionIds.Contains(condition.Id)).ToListAsync(cancellationToken);

    public Task<List<Medication>> GetMedicationsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken) =>
        dbContext.Medications.Where(medication => medicationIds.Contains(medication.Id)).ToListAsync(cancellationToken);

    public Task<bool> PatientExistsAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients.AnyAsync(patient => patient.UserId == userId, cancellationToken);

    public void Add(Patient patient) => dbContext.Patients.Add(patient);

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

    public Task<List<Patient>> GetByIdsReadOnlyAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken) =>
        dbContext.Patients.AsNoTracking().Where(patient => patientIds.Contains(patient.Id)).ToListAsync(cancellationToken);

    public Task<Patient?> GetByUserIdReadOnlyAsync(Guid userId, CancellationToken cancellationToken) =>
        dbContext.Patients.AsNoTracking().FirstOrDefaultAsync(patient => patient.UserId == userId, cancellationToken);

    public async Task<(List<Patient> Patients, int TotalCount)> GetAdminPageReadOnlyAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Patients.AsNoTracking().OrderBy(patient => patient.Id);
        var totalCount = await query.CountAsync(cancellationToken);
        var patients = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return (patients, totalCount);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);

    private IQueryable<Patient> Details() => dbContext.Patients
        .Include(patient => patient.Allergies)
        .Include(patient => patient.Conditions)
        .Include(patient => patient.Medications);
}
