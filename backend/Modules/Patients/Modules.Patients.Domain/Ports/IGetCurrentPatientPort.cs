using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetCurrentPatientPort
{
    Task<Patient?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
}
