using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Features.BanUser;

internal sealed class BanUserCommandHandler(
    UserManager<User> userManager,
    ILogger<BanUserCommandHandler> logger)
    : ICommandHandler<BanUserCommand>
{
    public async Task<Result> Handle(BanUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating ban status for user {UserId} to {IsBanned}", request.UserId, request.IsBanned);

        var user = await userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
        {
            return Result.Failure(Error.NotFound("Identity.UserNotFound", $"User with ID '{request.UserId}' not found."));
        }

        if (request.IsBanned)
        {
            var result = await userManager.SetLockoutEnabledAsync(user, true);
            if (!result.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.BanFailed", "Failed to enable lockout."));
            }

            var lockoutResult = await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
            if (!lockoutResult.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.BanFailed", "Failed to set lockout end date."));
            }

            await userManager.UpdateSecurityStampAsync(user);
        }
        else
        {
            var result = await userManager.SetLockoutEndDateAsync(user, null);
            if (!result.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.UnbanFailed", "Failed to remove lockout."));
            }
        }

        logger.LogInformation("User {UserId} ban status updated successfully", request.UserId);
        return Result.Success();
    }
}
