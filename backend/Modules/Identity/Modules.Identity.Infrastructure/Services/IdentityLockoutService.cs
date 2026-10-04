using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Services;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityLockoutService(UserManager<User> userManager) : IIdentityLockoutService
{
    public Task<bool> IsLockedOutAsync(User user) => userManager.IsLockedOutAsync(user);
    public async Task<IdentityOperationResult> SetLockoutEnabledAsync(User user, bool enabled) =>
        (await userManager.SetLockoutEnabledAsync(user, enabled)).ToOperationResult();

    public async Task<IdentityOperationResult> SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd) =>
        (await userManager.SetLockoutEndDateAsync(user, lockoutEnd)).ToOperationResult();

    public async Task<IdentityOperationResult> UpdateSecurityStampAsync(User user) =>
        (await userManager.UpdateSecurityStampAsync(user)).ToOperationResult();
}
