using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.GetPatient;

public sealed record GetPatientDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string DateOfBirth,
    string Gender,
    Address Address,
    EmergencyContact EmergencyContact,
    MedicalInfo MedicalInfo,
    string? Bio,
    string? ProfilePictureUrl,
    double? DistanceKm = null);