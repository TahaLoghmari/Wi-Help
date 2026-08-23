using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Domain.Ports;

public interface IGetRelationshipsPort
{
    Task<List<Relationship>> GetAllAsync(CancellationToken cancellationToken);
}
