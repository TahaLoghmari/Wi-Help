using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public static class UpdateUserErrors
{
    public static Error UserNotFound() => Error.NotFound(
        "UpdateUser.UserNotFound",
        "User not found");
    
    public static Error UpdateFailed() => Error.Failure(
        "UpdateUser.UpdateFailed",
        "Failed to update user");
}
