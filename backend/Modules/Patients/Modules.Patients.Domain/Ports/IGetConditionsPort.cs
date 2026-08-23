using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetConditionsPort
{
    Task<List<Condition>> GetAllAsync(CancellationToken cancellationToken);
}
