using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Infrastructure.DTOs;

public sealed record GetCurrentUserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    string Email,
    Address Address,
    string Role,
    string? ProfilePictureUrl,
    Coordinates? Location);