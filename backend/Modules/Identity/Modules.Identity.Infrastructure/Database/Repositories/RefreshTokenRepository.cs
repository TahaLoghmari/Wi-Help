using Microsoft.EntityFrameworkCore;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Repositories;

namespace Modules.Identity.Infrastructure.Database.Repositories;

public sealed class RefreshTokenRepository(IdentityDbContext dbContext) : IRefreshTokenRepository
{
    public Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken) =>
        dbContext.RefreshTokens.Include(refreshToken => refreshToken.User)
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token == token, cancellationToken);

    public void Add(RefreshToken refreshToken) => dbContext.RefreshTokens.Add(refreshToken);

    public void Remove(RefreshToken refreshToken) => dbContext.RefreshTokens.Remove(refreshToken);

    public async Task RemoveByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var refreshTokens = await dbContext.RefreshTokens
            .Where(refreshToken => refreshToken.UserId == userId)
            .ToListAsync(cancellationToken);
        dbContext.RefreshTokens.RemoveRange(refreshTokens);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken) =>
        await dbContext.SaveChangesAsync(cancellationToken);

    public Task<int> DeleteExpiredAsync(DateTime utcNow, CancellationToken cancellationToken) =>
        dbContext.RefreshTokens.Where(refreshToken => refreshToken.ExpiresAtUtc < utcNow)
            .ExecuteDeleteAsync(cancellationToken);
}
