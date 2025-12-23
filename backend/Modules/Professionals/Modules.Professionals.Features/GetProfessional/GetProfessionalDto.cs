using Modules.Common.Features.ValueObjects;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.GetProfessional;

public sealed record GetProfessionalDto(
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
    List<string>? Services,
    int Experience,
    int? VisitPrice,
    string? Bio,
    bool IsVerified,
    string? ProfilePictureUrl,
    VerificationStatus VerificationStatus,
    double? DistanceKm = null);