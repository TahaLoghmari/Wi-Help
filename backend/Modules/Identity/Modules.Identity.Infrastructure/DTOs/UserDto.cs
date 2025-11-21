using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.DTOs;

public sealed record UserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    string Email,
    Address Address,
    string Role);