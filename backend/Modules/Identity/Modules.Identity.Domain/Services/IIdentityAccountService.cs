using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Services;

public interface IIdentityAccountService
{
    Task<User?> FindByEmailAsync(string email);
    Task<User?> FindByIdAsync(string userId);
    Task<IReadOnlyList<User>> GetUsersByIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken);
    Task<IReadOnlyList<User>> GetUsersInRoleAsync(string role);
    Task<IList<string>> GetRolesAsync(User user);
    Task<bool> IsEmailConfirmedAsync(User user);
    Task<IdentityOperationResult> CreateAsync(User user, string password);
    Task<IdentityOperationResult> UpdateAsync(User user);
    Task<IdentityOperationResult> AddToRoleAsync(User user, string role);
    Task<IdentityOperationResult> ConfirmEmailAsync(User user, string token);
}
