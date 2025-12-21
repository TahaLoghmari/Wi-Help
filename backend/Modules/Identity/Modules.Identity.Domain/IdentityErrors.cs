using Modules.Common.Features.Results;

namespace Modules.Identity.Domain;

public static class IdentityErrors
{
    // User
    public static Error UserNotFound() => Error.NotFound(
        "Identity.UserNotFound",
        "User not found.");

    public static Error UserNotFound(string userId) => Error.NotFound(
        "Identity.UserNotFound",
        $"User with ID '{userId}' not found.");

    public static Error UserLockedOut() => Error.Problem(
        "Identity.UserLockedOut",
        "Your account has been banned. Please contact support.");

    public static Error UpdateUserFailed() => Error.Failure(
        "Identity.UpdateUserFailed",
        "Failed to update user.");

    // Auth / Login
    public static Error InvalidCredentials() => Error.Problem(
        "Identity.InvalidCredentials",
        "Invalid email or password.");

    public static Error EmailNotConfirmed() => Error.Problem(
        "Identity.EmailNotConfirmed",
        "Please confirm your email before logging in.");

    // Password
    public static Error InvalidCurrentPassword() => Error.Problem(
        "Identity.InvalidCurrentPassword",
        "Current password is incorrect.");

    public static Error PasswordChangeFailed(string details) => Error.Problem(
        "Identity.PasswordChangeFailed",
        $"Password change failed: {details}");

    // Registration
    public static Error UserAlreadyExists() => Error.Conflict(
        "Identity.UserAlreadyExists",
        "Email already exists.");

    public static Error InvalidRegistrationInput() => Error.Failure(
        "Identity.InvalidRegistrationInput",
        "Invalid registration input.");

    // Email Confirmation
    public static Error InvalidConfirmationToken() => Error.Problem(
        "Identity.InvalidConfirmationToken",
        "Invalid or expired confirmation token.");

    // Refresh Token
    public static Error RefreshTokenNotFound(Guid id) => Error.NotFound(
        "Identity.RefreshTokenNotFound",
        $"Refresh token with ID '{id}' not found.");

    public static Error RefreshTokenExpired(Guid id) => Error.Problem(
        "Identity.RefreshTokenExpired",
        $"Refresh token with ID '{id}' has expired.");

    public static Error RefreshTokenMissing() => Error.Unauthorized(
        "Identity.RefreshTokenMissing",
        "Refresh token is missing.");
}
