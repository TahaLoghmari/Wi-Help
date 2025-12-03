using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public static class ChangePasswordErrors
{
    public static Error UserNotFound() => Error.NotFound(
        "ChangePassword.UserNotFound",
        "User not found.");
    
    public static Error InvalidCurrentPassword() => Error.Problem(
        "ChangePassword.InvalidCurrentPassword",
        "Current password is incorrect.");
    
    public static Error PasswordChangeFailed(string details) => Error.Problem(
        "ChangePassword.PasswordChangeFailed",
        $"Password change failed: {details}");
}
