using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public static class ConfirmEmailErrors
{
    public static Error UserNotFound() => Error.NotFound(
        "ConfirmEmail.UserNotFound",
        "User not found");
    
    public static Error InvalidToken() => Error.Problem(
        "ConfirmEmail.InvalidToken",
        "Invalid or expired confirmation token");
}
