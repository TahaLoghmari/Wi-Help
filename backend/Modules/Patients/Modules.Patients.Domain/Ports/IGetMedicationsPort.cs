using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetMedicationsPort
{
    Task<List<Medication>> GetAllAsync(CancellationToken cancellationToken);
}
