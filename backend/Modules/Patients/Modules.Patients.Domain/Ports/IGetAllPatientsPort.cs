using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetAllPatientsPort
{
    Task<(List<Patient> Patients, int TotalCount)> GetPageAsync(int page, int pageSize, CancellationToken cancellationToken);
}
