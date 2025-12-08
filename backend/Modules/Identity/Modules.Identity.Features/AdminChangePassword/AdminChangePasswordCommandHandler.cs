using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;

namespace Modules.Identity.Features.AdminChangePassword;

internal sealed class AdminChangePasswordCommandHandler(
    UserManager<User> userManager,
    ILogger<AdminChangePasswordCommandHandler> logger)
    : ICommandHandler<AdminChangePasswordCommand>
{
    public async Task<Result> Handle(AdminChangePasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Admin changing password for user {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
        {
            return Result.Failure(Error.NotFound("Identity.UserNotFound", $"User with ID '{request.UserId}' not found."));
        }

        var removeResult = await userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
        {
            return Result.Failure(Error.Failure("Identity.PasswordChangeFailed", "Failed to remove old password."));
        }

        var addResult = await userManager.AddPasswordAsync(user, request.NewPassword);
        if (!addResult.Succeeded)
        {
            return Result.Failure(Error.Failure("Identity.PasswordChangeFailed", "Failed to set new password."));
        }

        logger.LogInformation("Password changed successfully for user {UserId}", request.UserId);
        return Result.Success();
    }
}
