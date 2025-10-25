using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public static class LoginErrors
{
    public static Error UserNotFound() => Error.NotFound(
        "Login.UserNotFound",
        "Invalid email or password");
    
    public static Error EmailNotConfirmed() => Error.Problem(
        "Login.EmailNotConfirmed",
        "Please confirm your email before logging in.");
    
    public static Error InvalidPassword() => Error.Problem(
        "Login.InvalidPassword",
        "Invalid email or password");
}
