using Modules.Common.Features.Results;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Identity.PublicApi;

public interface IIdentityModuleApi
{
    Task<Result<Guid>> CreateUserAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken);
    
    Task<Result<UserResponse>> GetUserByIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<Result<List<UserResponse>>> GetUsersByIdsAsync(
        IEnumerable<Guid> userIds,
        CancellationToken cancellationToken);
    
    Task<Result> UpdateUserAsync(
        UpdateUserRequest request,
        CancellationToken cancellationToken);
}
