using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Errors;
using Modules.Identity.Features.DTOs;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.Refresh;

public sealed class RefreshCommandHandler(
    TokenManagementService tokenManagementService,
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
            return Result<AccessTokensDto>.Failure(RefreshTokenErrors.Missing());
        }

        Result<AccessTokensDto> result = await tokenManagementService.RefreshUserTokens(command.RefreshTokenValue, cancellationToken);

        if (result.IsSuccess)
        {
            logger.LogInformation("Token refresh successful");
        }

        return result;
    }
}