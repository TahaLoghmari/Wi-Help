using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.Auth.GetCurrentUser;

public sealed record GetCurrentUserQuery(string? UserId) : IQuery<GetCurrentUserDto>;
