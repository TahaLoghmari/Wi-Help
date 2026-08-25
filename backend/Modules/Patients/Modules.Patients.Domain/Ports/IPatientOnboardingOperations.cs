using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IPatientOnboardingOperations
{
    Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken);
    Task<bool> PatientExistsAsync(Guid userId, CancellationToken cancellationToken);
    Task<Patient?> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task AddPatientAsync(Patient patient, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
