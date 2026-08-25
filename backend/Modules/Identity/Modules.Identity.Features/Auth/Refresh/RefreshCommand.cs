using Modules.Common.Features.Abstractions;
using Modules.Identity.Domain.DTOs;

namespace Modules.Identity.Features.Auth.Refresh;

public sealed record RefreshCommand(string? RefreshTokenValue) : ICommand;
