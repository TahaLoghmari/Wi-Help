using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.ResetPassword;

public sealed record ResetPasswordCommand(
    string Email,
    string Token,
    string NewPassword,
    string ConfirmPassword) : ICommand;
