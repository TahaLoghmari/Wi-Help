using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

public sealed record UpdateProfessionalCommand(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address,
    string? Specialization,
    List<string>? Services,
    int? Experience,
    int? StartPrice,
    int? EndPrice,
    string? Bio) : ICommand;
