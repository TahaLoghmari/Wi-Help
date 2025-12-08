using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.GetProfessionalsForAdmin;

public sealed record GetProfessionalsForAdminDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string ProfilePictureUrl,
    string Specialization,
    DateTime CreatedAt,
    decimal TotalEarned,
    VerificationStatus AccountStatus,
    bool IsBanned
);
