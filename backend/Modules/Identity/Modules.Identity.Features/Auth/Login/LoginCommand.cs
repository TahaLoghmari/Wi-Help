using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.Login;

public sealed record LoginCommand(string Email, string Password) : ICommand;