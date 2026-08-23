using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetAllergiesPort
{
    Task<List<Allergy>> GetAllAsync(CancellationToken cancellationToken);
}
