using Modules.Common.Features.Results;
using Modules.Identity.Domain.DTOs;

namespace Modules.Identity.Domain.Services;

public interface ITokenManagement
{
    Task<AccessTokensDto> CreateAndStoreTokens(Guid userId, string role, string email, CancellationToken cancellationToken);
    Task<Result<AccessTokensDto>> RefreshUserTokens(string refreshTokenValue, CancellationToken cancellationToken);
    Task RemoveRefreshToken(string refreshTokenValue, CancellationToken cancellationToken);
}
