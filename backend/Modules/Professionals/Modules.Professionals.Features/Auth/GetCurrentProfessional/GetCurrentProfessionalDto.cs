using Modules.Common.Features.ValueObjects;
using Modules.Professionals.Domain.Enums;
using Modules.Professionals.Features.GetServices;
using Modules.Professionals.Features.GetSpecializations;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

public sealed record GetCurrentProfessionalDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string Gender,
    Address Address,
    SpecializationDto Specialization,
    List<ServiceDto> Services,
    int Experience,
    int VisitPrice,
    string? Bio,
    string? ProfilePictureUrl,
    VerificationStatus VerificationStatus);
