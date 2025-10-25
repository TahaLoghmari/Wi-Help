using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;
using Modules.Identity.Features.DTOs;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.Login;

public sealed class LoginCommandHandler(
    UserManager<User> userManager,
    TokenManagementService tokenManagementService,
    ILogger<LoginCommandHandler> logger) : ICommandHandler<LoginCommand>
{
    public async Task<Result> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Login attempt started for {Email}", command.Email);

        User? user = await userManager.FindByEmailAsync(command.Email);
        
        if (user is null)
        {
            logger.LogWarning("Login failed - user not found for {Email}", command.Email);
            return Result.Failure(LoginErrors.UserNotFound);
        }

        if (!await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Login failed - email not confirmed for {Email}, UserId: {UserId}", 
                command.Email, user.Id);
            return Result.Failure(LoginErrors.EmailNotConfirmed);
        }

        var result = await userManager.CheckPasswordAsync(user, command.Password);

        if (!result)
        {
            logger.LogWarning("Login failed - invalid password for {Email}, UserId: {UserId}", 
                command.Email, user.Id);
            return Result.Failure(LoginErrors.InvalidPassword);
        }
        
        AccessTokensDto tokens = await tokenManagementService.CreateAndStoreTokens(user.Id, command.Email, cancellationToken);

        logger.LogInformation("Login successful for {Email}, UserId: {UserId}", 
            command.Email, user.Id);

        return Result.Success();
    }
}