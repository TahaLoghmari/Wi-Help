using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.DTOs;

public sealed record UserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Gender,
    Address Address,
    DateTime DateOfBirth,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string Email,
    string PhoneNumber,
    string UserName,
    string Role);