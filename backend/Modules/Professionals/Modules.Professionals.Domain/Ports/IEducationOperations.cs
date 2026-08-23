using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Ports;

public interface IEducationOperations
{
    Task<IReadOnlyList<Education>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Education?> FindAsync(Guid educationId, Guid professionalId, CancellationToken cancellationToken);
    void Add(Education education);
    void Remove(Education education);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
