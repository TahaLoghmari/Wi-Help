using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.PublicApi.Contracts;

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    string? ProfilePictureUrl,
    bool IsBanned,
    Coordinates? Location);
