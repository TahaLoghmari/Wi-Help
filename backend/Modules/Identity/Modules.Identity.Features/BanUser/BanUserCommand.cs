using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.BanUser;

public sealed record BanUserCommand(Guid UserId, bool IsBanned) : ICommand;
