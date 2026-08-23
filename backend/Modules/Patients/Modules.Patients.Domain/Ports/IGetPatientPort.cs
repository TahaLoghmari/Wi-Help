using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetPatientPort
{
    Task<Patient?> GetByIdAsync(Guid patientId, CancellationToken cancellationToken);
}
