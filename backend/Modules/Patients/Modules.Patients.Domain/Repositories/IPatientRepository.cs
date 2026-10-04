using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Patient?> GetByIdAsync(Guid patientId, CancellationToken cancellationToken);
    Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken);
    Task<List<Allergy>> GetAllergiesAsync(IEnumerable<Guid> allergyIds, CancellationToken cancellationToken);
    Task<List<Condition>> GetConditionsAsync(IEnumerable<Guid> conditionIds, CancellationToken cancellationToken);
    Task<List<Medication>> GetMedicationsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken);
    Task<bool> PatientExistsAsync(Guid userId, CancellationToken cancellationToken);
    void Add(Patient patient);
    Task<(List<Patient> Patients, int TotalCount)> GetPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<List<Patient>> GetByIdsReadOnlyAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken);
    Task<Patient?> GetByUserIdReadOnlyAsync(Guid userId, CancellationToken cancellationToken);
    Task<(List<Patient> Patients, int TotalCount)> GetAdminPageReadOnlyAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
