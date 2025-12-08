using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.AdminChangePassword;

public sealed record AdminChangePasswordCommand(Guid UserId, string NewPassword) : ICommand;
