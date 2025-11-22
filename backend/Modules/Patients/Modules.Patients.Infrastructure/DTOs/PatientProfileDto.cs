using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Features.Auth.GetCurrentPatient;

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
    EmergencyContact EmergencyContact);
