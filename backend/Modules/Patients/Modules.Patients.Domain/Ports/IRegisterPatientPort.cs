using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IRegisterPatientPort
{
    Task<bool> RelationshipExistsAsync(Guid relationshipId, CancellationToken cancellationToken);
    Task<bool> PatientExistsAsync(Guid userId, CancellationToken cancellationToken);
    Task AddPatientAsync(Patient patient, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
