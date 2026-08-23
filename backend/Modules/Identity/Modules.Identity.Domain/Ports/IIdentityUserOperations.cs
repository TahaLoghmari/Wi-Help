using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Ports;

public interface IIdentityUserOperations
{
    Task<User?> FindByEmailAsync(string email);
    Task<User?> FindByIdAsync(string userId);
    Task<IReadOnlyList<User>> GetUsersByIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken);
    Task<IReadOnlyList<User>> GetUsersInRoleAsync(string role);
    Task<IList<string>> GetRolesAsync(User user);
    Task<bool> IsEmailConfirmedAsync(User user);
    Task<bool> IsLockedOutAsync(User user);
    Task<bool> CheckPasswordAsync(User user, string password);
    Task<IdentityResult> CreateAsync(User user, string password);
    Task<IdentityResult> UpdateAsync(User user);
    Task<IdentityResult> AddToRoleAsync(User user, string role);
    Task<IdentityResult> AddClaimAsync(User user, Claim claim);
    Task<IdentityResult> ConfirmEmailAsync(User user, string token);
    Task<IdentityResult> ResetPasswordAsync(User user, string token, string newPassword);
    Task<IdentityResult> ChangePasswordAsync(User user, string currentPassword, string newPassword);
    Task<IdentityResult> RemovePasswordAsync(User user);
    Task<IdentityResult> AddPasswordAsync(User user, string password);
    Task<IdentityResult> SetLockoutEnabledAsync(User user, bool enabled);
    Task<IdentityResult> SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd);
    Task<IdentityResult> UpdateSecurityStampAsync(User user);
}
