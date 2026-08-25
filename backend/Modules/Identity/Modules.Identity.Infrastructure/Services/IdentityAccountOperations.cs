using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityAccountOperations(UserManager<User> userManager) : IIdentityAccountOperations
{
    public Task<User?> FindByEmailAsync(string email) => userManager.FindByEmailAsync(email);
    public Task<User?> FindByIdAsync(string userId) => userManager.FindByIdAsync(userId);

    public async Task<IReadOnlyList<User>> GetUsersByIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken) =>
        await userManager.Users.AsNoTracking().Where(user => userIds.Contains(user.Id)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<User>> GetUsersInRoleAsync(string role) => (await userManager.GetUsersInRoleAsync(role)).ToList();
    public Task<IList<string>> GetRolesAsync(User user) => userManager.GetRolesAsync(user);
    public Task<bool> IsEmailConfirmedAsync(User user) => userManager.IsEmailConfirmedAsync(user);
    public async Task<IdentityOperationResult> CreateAsync(User user, string password) =>
        (await userManager.CreateAsync(user, password)).ToOperationResult();

    public async Task<IdentityOperationResult> UpdateAsync(User user) =>
        (await userManager.UpdateAsync(user)).ToOperationResult();

    public async Task<IdentityOperationResult> AddToRoleAsync(User user, string role) =>
        (await userManager.AddToRoleAsync(user, role)).ToOperationResult();

    public async Task<IdentityOperationResult> ConfirmEmailAsync(User user, string token) =>
        (await userManager.ConfirmEmailAsync(user, token)).ToOperationResult();
}
