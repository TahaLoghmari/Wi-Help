using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityUserOperations(UserManager<User> userManager) : IIdentityUserOperations
{
    public Task<User?> FindByEmailAsync(string email) => userManager.FindByEmailAsync(email);
    public Task<User?> FindByIdAsync(string userId) => userManager.FindByIdAsync(userId);

    public async Task<IReadOnlyList<User>> GetUsersByIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken) =>
        await userManager.Users.AsNoTracking().Where(user => userIds.Contains(user.Id)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<User>> GetUsersInRoleAsync(string role) => (await userManager.GetUsersInRoleAsync(role)).ToList();
    public Task<IList<string>> GetRolesAsync(User user) => userManager.GetRolesAsync(user);
    public Task<bool> IsEmailConfirmedAsync(User user) => userManager.IsEmailConfirmedAsync(user);
    public Task<bool> IsLockedOutAsync(User user) => userManager.IsLockedOutAsync(user);
    public Task<bool> CheckPasswordAsync(User user, string password) => userManager.CheckPasswordAsync(user, password);
    public Task<IdentityResult> CreateAsync(User user, string password) => userManager.CreateAsync(user, password);
    public Task<IdentityResult> UpdateAsync(User user) => userManager.UpdateAsync(user);
    public Task<IdentityResult> AddToRoleAsync(User user, string role) => userManager.AddToRoleAsync(user, role);
    public Task<IdentityResult> AddClaimAsync(User user, Claim claim) => userManager.AddClaimAsync(user, claim);
    public Task<IdentityResult> ConfirmEmailAsync(User user, string token) => userManager.ConfirmEmailAsync(user, token);
    public Task<IdentityResult> ResetPasswordAsync(User user, string token, string newPassword) => userManager.ResetPasswordAsync(user, token, newPassword);
    public Task<IdentityResult> ChangePasswordAsync(User user, string currentPassword, string newPassword) => userManager.ChangePasswordAsync(user, currentPassword, newPassword);
    public Task<IdentityResult> RemovePasswordAsync(User user) => userManager.RemovePasswordAsync(user);
    public Task<IdentityResult> AddPasswordAsync(User user, string password) => userManager.AddPasswordAsync(user, password);
    public Task<IdentityResult> SetLockoutEnabledAsync(User user, bool enabled) => userManager.SetLockoutEnabledAsync(user, enabled);
    public Task<IdentityResult> SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd) => userManager.SetLockoutEndDateAsync(user, lockoutEnd);
    public Task<IdentityResult> UpdateSecurityStampAsync(User user) => userManager.UpdateSecurityStampAsync(user);
}
