using Modules.Common.Features.Results;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Identity.PublicApi;

public interface IIdentityModuleApi
{
    Task<Result<Guid>> CreateUserAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken);
    
    Task<Result<UserDto>> GetUserByIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<Result<List<UserDto>>> GetUsersByIdsAsync(
        IEnumerable<Guid> userIds,
        CancellationToken cancellationToken);
    
    Task<Result> UpdateUserAsync(
        UpdateUserRequest request,
        CancellationToken cancellationToken);
    
    Task<Result> AddClaimAsync(
        Guid userId,
        string claimType,
        string claimValue,
        CancellationToken cancellationToken);
    
    Task<Result> BanUserAsync(
        Guid userId,
        CancellationToken cancellationToken);
    
    Task<Result> UnbanUserAsync(
        Guid userId,
        CancellationToken cancellationToken);
    
    Task<Result> ResetUserPasswordAsync(
        Guid userId,
        string newPassword,
        CancellationToken cancellationToken);

    Task<Result<List<UserDto>>> GetUsersByRoleAsync(
        string role,
        CancellationToken cancellationToken);
}
