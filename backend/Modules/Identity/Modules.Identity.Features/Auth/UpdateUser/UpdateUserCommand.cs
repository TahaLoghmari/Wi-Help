using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.Auth.UpdateUser;

public sealed record UpdateUserCommand(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address,
    EmergencyContact? EmergencyContact,
    string? Specialization,
    List<string>? Services,
    int? Experience,
    int? StartPrice,
    int? EndPrice,
    string? Bio) : ICommand;
