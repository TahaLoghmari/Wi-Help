using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IPatientProfileOperations
{
    Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Patient?> GetByIdAsync(Guid patientId, CancellationToken cancellationToken);
    Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken);
    Task<List<Allergy>> GetAllergiesAsync(IEnumerable<Guid> allergyIds, CancellationToken cancellationToken);
    Task<List<Condition>> GetConditionsAsync(IEnumerable<Guid> conditionIds, CancellationToken cancellationToken);
    Task<List<Medication>> GetMedicationsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
