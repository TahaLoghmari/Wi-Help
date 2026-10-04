using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Repositories;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken);
    void Add(RefreshToken refreshToken);
    void Remove(RefreshToken refreshToken);
    Task RemoveByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task<int> DeleteExpiredAsync(DateTime utcNow, CancellationToken cancellationToken);
}
