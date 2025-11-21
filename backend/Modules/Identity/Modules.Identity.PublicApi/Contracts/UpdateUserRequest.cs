using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.PublicApi.Contracts;

public record UpdateUserRequest(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address);
