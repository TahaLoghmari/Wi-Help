using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.ForgotPassword;

public sealed record ForgotPasswordCommand(string Email) : ICommand;
