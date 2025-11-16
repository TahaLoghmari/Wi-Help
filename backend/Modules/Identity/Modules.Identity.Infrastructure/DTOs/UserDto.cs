using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.DTOs;

public sealed record UserDto(
    Guid Id,
    string Email,
    string UserName,
    string ImageUrl,
    string Role);