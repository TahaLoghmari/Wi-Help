using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IPatientModuleApiPort
{
    Task<List<Patient>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken);
    Task<Patient?> GetPatientByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<(List<Patient> Patients, int TotalCount)> GetPatientsForAdminAsync(int page, int pageSize, CancellationToken cancellationToken);
}
