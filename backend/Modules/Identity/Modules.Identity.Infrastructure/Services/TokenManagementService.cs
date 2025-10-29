using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;
using Modules.Identity.Features.DTOs;
using Modules.Identity.Infrastructure.Database;
using Modules.Identity.Infrastructure.Settings;

namespace Modules.Identity.Infrastructure.Services;

public sealed class TokenManagementService(
    IdentityDbContext identityDbContext,
    IOptions<JwtSettings> jwtAuthSettings,
    TokenProvider tokenProvider,
    ILogger<TokenManagementService> logger
)
{
    private readonly JwtSettings _jwtAuthSettings = jwtAuthSettings.Value;

    public async Task<AccessTokensDto> CreateAndStoreTokens(
        Guid userId,
        string role,
        string email,
        CancellationToken cancellationToken)
    {

        var oldRefreshTokens = identityDbContext.RefreshTokens
            .Where(rt => rt.UserId == userId);
        identityDbContext.RefreshTokens.RemoveRange(oldRefreshTokens);

        TokenRequest tokenRequest = new TokenRequest(userId, email);
        AccessTokensDto accessTokens = tokenProvider.Create(tokenRequest,role);

        var refreshToken = new RefreshToken
        {
            Id = Guid.CreateVersion7(),
            UserId = userId,
            Token = accessTokens.RefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthSettings.RefreshTokenExpirationDays)
        };

        identityDbContext.RefreshTokens.Add(refreshToken);

        await identityDbContext.SaveChangesAsync(cancellationToken);

        return accessTokens;
    }

    public async Task<Result<AccessTokensDto>> RefreshUserTokens(
        Guid userId,
        string role,
        string refreshTokenValue,
        CancellationToken cancellationToken)
    {
        var refreshToken = await identityDbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue, cancellationToken);

        if (refreshToken is null)
        {
            logger.LogWarning("Token refresh failed - refresh token not found");
            return Result<AccessTokensDto>.Failure(RefreshTokenErrors.NotFound(Guid.Empty));
        }

        if (refreshToken.ExpiresAtUtc < DateTime.UtcNow)
        {
            logger.LogWarning("Token refresh failed - expired refresh token");
            identityDbContext.RefreshTokens.Remove(refreshToken);
            await identityDbContext.SaveChangesAsync(cancellationToken);
            return Result<AccessTokensDto>.Failure(RefreshTokenErrors.Expired(refreshToken.Id));
        }

        var tokenRequest = new TokenRequest(refreshToken.User.Id, refreshToken.User.Email!);
        AccessTokensDto tokens = tokenProvider.Create(tokenRequest,role);

        refreshToken.Token = tokens.RefreshToken;
        refreshToken.ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthSettings.RefreshTokenExpirationDays);

        await identityDbContext.SaveChangesAsync(cancellationToken);

        return Result<AccessTokensDto>.Success(tokens);
    }

    public async Task RemoveRefreshToken(
        string refreshTokenValue,
        CancellationToken cancellationToken)
    {
        var refreshToken = await identityDbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue,cancellationToken);

        if (refreshToken is null)
        {
            logger.LogInformation("Attempted to remove a refresh token that was not found or already removed.");
            return;
        }

        identityDbContext.RefreshTokens.Remove(refreshToken);
        await identityDbContext.SaveChangesAsync(cancellationToken);
    }
    
    public async Task CleanupExpiredTokens()
    {
        logger.LogInformation("Starting cleanup of expired refresh tokens");
    
        var expiredTokens = identityDbContext.RefreshTokens
            .Where(rt => rt.ExpiresAtUtc < DateTime.UtcNow);
    
        var deletedCount = await expiredTokens.ExecuteDeleteAsync();
    
        logger.LogInformation("Cleaned up {DeletedCount} expired refresh tokens", deletedCount);
    }
    
}