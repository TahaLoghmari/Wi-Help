using Microsoft.AspNetCore.Identity;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Services;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityCredentialService(UserManager<User> userManager) : IIdentityCredentialService
{
    public Task<bool> CheckPasswordAsync(User user, string password) => userManager.CheckPasswordAsync(user, password);
    public async Task<IdentityOperationResult> ResetPasswordAsync(User user, string token, string newPassword) =>
        (await userManager.ResetPasswordAsync(user, token, newPassword)).ToOperationResult();

    public async Task<IdentityOperationResult> ChangePasswordAsync(User user, string currentPassword, string newPassword) =>
        (await userManager.ChangePasswordAsync(user, currentPassword, newPassword)).ToOperationResult();

    public async Task<IdentityOperationResult> RemovePasswordAsync(User user) =>
        (await userManager.RemovePasswordAsync(user)).ToOperationResult();

    public async Task<IdentityOperationResult> AddPasswordAsync(User user, string password) =>
        (await userManager.AddPasswordAsync(user, password)).ToOperationResult();
}
