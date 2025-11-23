using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Infrastructure.DTOs;

public sealed record PatientProfileDto(
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
    MedicalInfoDto MedicalInfo,
    string Bio,
    string ProfilePictureUrl);

public sealed record MedicalInfoDto(
    List<string> ChronicConditions,
    List<string> Allergies,
    List<string> Medications,
    string MobilityStatus);
