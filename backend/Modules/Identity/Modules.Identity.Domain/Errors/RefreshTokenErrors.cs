using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public static class RefreshTokenErrors
{
    public static Error NotFound(Guid id) => Error.NotFound(
        "RefreshToken.NotFound",
        $"Refresh token with ID '{id}' not found.");
    
    public static Error Expired(Guid id) => Error.Problem(
        "RefreshToken.Expired",
        $"Refresh token with ID '{id}' has expired.");
    
    public static Error Invalid(Guid id) => Error.Problem(
        "RefreshToken.Invalid",
        $"Refresh token with ID '{id}' is invalid.");
}
