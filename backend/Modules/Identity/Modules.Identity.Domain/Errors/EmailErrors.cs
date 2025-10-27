using Modules.Common.Features.Results;

namespace Modules.Identity.Domain.Errors;

public class EmailErrors
{
    public static Error PasswordResetLinkGenerationFailed() => Error.Failure(
        "PasswordReset.LinkGenerationFailed",
        "Could not generate a valid reset password link.");
    
    public static Error EmailConfirmationLinkGenerationFailed() => Error.Failure(
        "EmailConfirmation.LinkGenerationFailed",
        "Could not generate a valid email confirmation link.");
    
    public static Error EmailSendingFailed() => Error.Failure(
        "Email.SendingFailed",
        "Failed to send the email.");
}