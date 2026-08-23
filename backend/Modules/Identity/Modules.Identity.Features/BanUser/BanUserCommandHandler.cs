using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Features.BanUser;

internal sealed class BanUserCommandHandler(
    IIdentityUserOperations users,
    ILogger<BanUserCommandHandler> logger)
    : ICommandHandler<BanUserCommand>
{
    public async Task<Result> Handle(BanUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating ban status for user {UserId} to {IsBanned}", request.UserId, request.IsBanned);

        var user = await users.FindByIdAsync(request.UserId.ToString());
        if (user is null)
        {
            return Result.Failure(Error.NotFound("Identity.UserNotFound", $"User with ID '{request.UserId}' not found."));
        }

        if (request.IsBanned)
        {
            var result = await users.SetLockoutEnabledAsync(user, true);
            if (!result.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.BanFailed", "Failed to enable lockout."));
            }

            var lockoutResult = await users.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
            if (!lockoutResult.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.BanFailed", "Failed to set lockout end date."));
            }

            await users.UpdateSecurityStampAsync(user);
        }
        else
        {
            var result = await users.SetLockoutEndDateAsync(user, null);
            if (!result.Succeeded)
            {
                return Result.Failure(Error.Failure("Identity.UnbanFailed", "Failed to remove lockout."));
            }
        }

        logger.LogInformation("User {UserId} ban status updated successfully", request.UserId);
        return Result.Success();
    }
}
