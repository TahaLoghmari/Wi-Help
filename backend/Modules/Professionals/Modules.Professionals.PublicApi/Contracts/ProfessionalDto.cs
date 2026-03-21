using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.PublicApi.Contracts;

public sealed record ServiceDto(Guid Id, string Key);

public sealed record ProfessionalDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string Gender,
    Address Address,
    Guid SpecializationId,
    string SpecializationKey,
    List<ServiceDto> Services,
    int Experience,
    int VisitPrice,
    string? Bio,
    string? ProfilePictureUrl);
