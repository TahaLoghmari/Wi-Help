using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Repositories;

public interface IProfessionalCatalogRepository
{
    Task<Specialization?> FindSpecializationAsync(Guid specializationId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Specialization>> GetSpecializationsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<Service>> GetServicesAsync(Guid specializationId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Service>> GetServicesByIdsAsync(IEnumerable<Guid> serviceIds, CancellationToken cancellationToken);
}
