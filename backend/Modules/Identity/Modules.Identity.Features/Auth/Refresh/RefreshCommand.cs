using Modules.Common.Features.Abstractions;
using Modules.Identity.Features.DTOs;

namespace Modules.Identity.Features.Auth.Refresh;

public sealed record RefreshCommand(string? RefreshTokenValue) : ICommand;