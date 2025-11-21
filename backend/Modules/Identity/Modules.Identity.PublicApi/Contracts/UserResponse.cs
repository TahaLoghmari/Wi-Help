using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.PublicApi.Contracts;

public record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    Address Address,
    string Role);
