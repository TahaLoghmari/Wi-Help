using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Repositories;

public interface IProfessionalRepository
{
    Task<Professional?> FindByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Professional?> FindByIdAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Professional?> FindByUserIdReadOnlyAsync(Guid userId, CancellationToken cancellationToken);
    Task<Professional?> FindByIdReadOnlyAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<Professional?> FindByUserIdWithDetailsAsync(Guid userId, CancellationToken cancellationToken);
    Task<Professional?> FindByUserIdWithDetailsReadOnlyAsync(Guid userId, CancellationToken cancellationToken);
    Task<Professional?> FindByIdWithDetailsAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Professional>> GetByIdsWithDetailsAsync(IEnumerable<Guid> professionalIds, CancellationToken cancellationToken);
    Task<IReadOnlyList<Professional>> GetAllWithDetailsAsync(decimal? maxPrice, CancellationToken cancellationToken);
    Task<IReadOnlyList<Professional>> GetAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<IReadOnlyList<Professional>> GetPublicApiAdminPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<IReadOnlyList<Professional>> GetVerificationPageAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<int> CountAsync(CancellationToken cancellationToken);
    void Add(Professional professional);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
