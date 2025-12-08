using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.PublicApi.Contracts;

public sealed record ProfessionalAdminDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string? ProfilePictureUrl,
    string Email,
    string? PhoneNumber,
    string Specialization,
    DateTime CreatedAt,
    decimal TotalEarned,
    VerificationStatus VerificationStatus);
