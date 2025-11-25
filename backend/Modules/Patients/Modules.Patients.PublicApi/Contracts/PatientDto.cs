using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.PublicApi.Contracts;

public record PatientDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string? ProfilePictureUrl,
    string DateOfBirth,
    string Gender,
    Address Address,
    EmergencyContact EmergencyContact,
    MedicalInfo? MedicalInfo,
    string? Bio
);
