using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public class RegisterErrors
{
    public static Error UserExists() => Error.Conflict(
        "Registration failed",
        "Email already exists");
    
    public static Error InvalidInput() => Error.Failure(
        "Registration failed",
        "Invalid registration input");
    
    public static Error EmailNotConfirmed() => Error.Problem(
        "Login.EmailNotConfirmed",
        "Please confirm your email before logging in.");
    
    public static Error InvalidPassword() => Error.Problem(
        "Login.InvalidPassword",
        "Invalid email or password");
}