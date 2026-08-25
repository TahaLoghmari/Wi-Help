using Modules.Identity.Domain;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Ports;

public interface IIdentityCredentialOperations
{
    Task<bool> CheckPasswordAsync(User user, string password);
    Task<IdentityOperationResult> ResetPasswordAsync(User user, string token, string newPassword);
    Task<IdentityOperationResult> ChangePasswordAsync(User user, string currentPassword, string newPassword);
    Task<IdentityOperationResult> RemovePasswordAsync(User user);
    Task<IdentityOperationResult> AddPasswordAsync(User user, string password);
}
