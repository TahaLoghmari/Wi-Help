using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Services;

namespace Modules.Identity.Features.Auth.ChangePassword;

public sealed class ChangePasswordCommandHandler(
    IIdentityAccountService accounts,
    IIdentityCredentialService credentials,
    ILogger<ChangePasswordCommandHandler> logger) : ICommandHandler<ChangePasswordCommand>
{
    public async Task<Result> Handle(
        ChangePasswordCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Password change attempt started for UserId: {UserId}", command.UserId);

        var user = await accounts.FindByIdAsync(command.UserId.ToString());
        
        if (user is null)
        {
            logger.LogWarning("Password change failed - user not found for UserId: {UserId}", command.UserId);
            return Result.Failure(IdentityErrors.UserNotFound());
        }

        var isCurrentPasswordValid = await credentials.CheckPasswordAsync(user, command.CurrentPassword);

        if (!isCurrentPasswordValid)
        {
            logger.LogWarning("Password change failed - invalid current password for UserId: {UserId}", command.UserId);
            return Result.Failure(IdentityErrors.InvalidCurrentPassword());
        }

        var result = await credentials.ChangePasswordAsync(user, command.CurrentPassword, command.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            logger.LogWarning("Password change failed for UserId: {UserId}. Errors: {Errors}", command.UserId, errors);
            return Result.Failure(IdentityErrors.PasswordChangeFailed(errors));
        }

        logger.LogInformation("Password changed successfully for UserId: {UserId}", command.UserId);

        return Result.Success();
    }
}
