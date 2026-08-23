using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Ports;

public interface IAwardOperations
{
    Task<IReadOnlyList<Award>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Award?> FindAsync(Guid awardId, Guid professionalId, CancellationToken cancellationToken);
    void Add(Award award);
    void Remove(Award award);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
