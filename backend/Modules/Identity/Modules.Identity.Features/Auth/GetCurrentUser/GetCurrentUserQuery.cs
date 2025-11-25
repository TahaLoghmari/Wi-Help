using Modules.Common.Features.Abstractions;
using Modules.Identity.Infrastructure.DTOs;

namespace Modules.Identity.Features.Auth.GetCurrentUser;

public sealed record GetCurrentUserQuery(string? UserId) : IQuery<GetCurrentUserDto>;