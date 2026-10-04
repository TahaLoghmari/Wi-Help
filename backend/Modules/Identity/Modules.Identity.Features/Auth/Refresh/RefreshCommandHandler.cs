using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain;
using Modules.Identity.Domain.DTOs;
using Modules.Identity.Domain.Services;

namespace Modules.Identity.Features.Auth.Refresh;

public sealed class RefreshCommandHandler(
    ITokenManagement tokenManagement,
    ILogger<RefreshCommandHandler> logger) : ICommandHandler<RefreshCommand, AccessTokensDto>
{
    public async Task<Result<AccessTokensDto>> Handle(
        RefreshCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Token refresh attempt started");

        if (string.IsNullOrEmpty(command.RefreshTokenValue))
        {
            logger.LogWarning("Token refresh failed - refresh token missing");
            return Result<AccessTokensDto>.Failure(IdentityErrors.RefreshTokenMissing());
        }

        Result<AccessTokensDto> result = await tokenManagement.RefreshUserTokens(command.RefreshTokenValue, cancellationToken);

        if (result.IsSuccess)
        {
            logger.LogInformation("Token refresh successful");
        }

        return result;
    }
}
