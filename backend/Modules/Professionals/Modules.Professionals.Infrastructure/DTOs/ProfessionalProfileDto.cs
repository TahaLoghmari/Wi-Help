using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

public sealed record ProfessionalProfileDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string Gender,
    Address Address,
    string Specialization,
    List<string> Services,
    int Experience,
    int StartPrice,
    int EndPrice,
    string Bio,
    bool IsVerified,
    string Role);
