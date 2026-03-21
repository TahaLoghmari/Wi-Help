using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.Enums;
using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Features.GetAllergies;
using Modules.Patients.Features.GetConditions;
using Modules.Patients.Features.GetMedications;

namespace Modules.Patients.Features.Auth.GetCurrentPatient;

public sealed record GetCurrentPatientDto(
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
    MobilityStatus? MobilityStatus,
    List<AllergyDto> Allergies,
    List<ConditionDto> Conditions,
    List<MedicationDto> Medications,
    string? Bio,
    string? ProfilePictureUrl);

