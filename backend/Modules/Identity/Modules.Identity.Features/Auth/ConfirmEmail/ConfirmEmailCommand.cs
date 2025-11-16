using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.ConfirmEmail;

public sealed record ConfirmEmailCommand(
    string UserId,
    string Token) : ICommand;
