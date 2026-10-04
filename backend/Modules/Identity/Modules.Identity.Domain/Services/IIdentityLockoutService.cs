using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Services;

public interface IIdentityLockoutService
{
    Task<bool> IsLockedOutAsync(User user);
    Task<IdentityOperationResult> SetLockoutEnabledAsync(User user, bool enabled);
    Task<IdentityOperationResult> SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd);
    Task<IdentityOperationResult> UpdateSecurityStampAsync(User user);
}
