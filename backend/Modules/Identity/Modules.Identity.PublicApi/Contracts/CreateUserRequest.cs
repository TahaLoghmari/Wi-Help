using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.PublicApi.Contracts;

public record CreateUserRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Gender,
    string PhoneNumber,
    string Role,
    Address Address);
