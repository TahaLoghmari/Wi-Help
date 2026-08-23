using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IPatientCatalogOperations
{
    Task<List<Allergy>> GetAllergiesAsync(CancellationToken cancellationToken);
    Task<List<Condition>> GetConditionsAsync(CancellationToken cancellationToken);
    Task<List<Medication>> GetMedicationsAsync(CancellationToken cancellationToken);
    Task<List<Relationship>> GetRelationshipsAsync(CancellationToken cancellationToken);
}
