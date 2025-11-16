using Modules.Common.Features.Abstractions;
using Modules.Identity.Features.DTOs;

namespace Modules.Identity.Features.Auth.GetCurrentUser;

public sealed record GetCurrentUserQuery(string? UserId) : IQuery<UserDto>;