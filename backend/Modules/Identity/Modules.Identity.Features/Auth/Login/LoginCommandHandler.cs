using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain;
using Modules.Identity.Domain.DTOs;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Features.Auth.Login;

public sealed class LoginCommandHandler(
    IIdentityUserOperations users,
    ITokenManagement tokenManagement,
    ILogger<LoginCommandHandler> logger) : ICommandHandler<LoginCommand,AccessTokensDto>
{
    public async Task<Result<AccessTokensDto>> Handle(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Login attempt started for {Email}", command.Email);

        var user = await users.FindByEmailAsync(command.Email);
        
        if (user is null)
        {
            logger.LogWarning("Login failed - user not found for {Email}", command.Email);
            return Result<AccessTokensDto>.Failure(IdentityErrors.InvalidCredentials());
        }

        if (!await users.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Login failed - email not confirmed for {Email}, UserId: {UserId}", 
                command.Email, user.Id);
            return Result<AccessTokensDto>.Failure(IdentityErrors.EmailNotConfirmed());
        }

        if (await users.IsLockedOutAsync(user))
        {
            logger.LogWarning("Login failed - user is locked out for {Email}, UserId: {UserId}", 
                command.Email, user.Id);
            return Result<AccessTokensDto>.Failure(IdentityErrors.UserLockedOut());
        }

        var result = await users.CheckPasswordAsync(user, command.Password);

        if (!result)
        {
            logger.LogWarning("Login failed - invalid password for {Email}, UserId: {UserId}", 
                command.Email, user.Id);
            return Result<AccessTokensDto>.Failure(IdentityErrors.InvalidCredentials());
        }
        
        var userRoles = await users.GetRolesAsync(user);
        
        AccessTokensDto tokens = await tokenManagement.CreateAndStoreTokens(user.Id, userRoles[0], command.Email, cancellationToken);

        logger.LogInformation("Login successful for {Email}, UserId: {UserId}",
            command.Email, user.Id);

        return Result<AccessTokensDto>.Success(tokens);
    }
}
