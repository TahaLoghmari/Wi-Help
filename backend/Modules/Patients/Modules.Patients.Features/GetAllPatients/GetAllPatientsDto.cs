using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.ValueObjects;

namespace Modules.Patients.Features.GetAllPatients;

public sealed record GetAllPatientsDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string ProfilePictureUrl,
    int Age,
    string DateOfBirth,
    string Gender,
    Address Address,
    EmergencyContact EmergencyContact,
    MedicalInfo MedicalInfo,
    string? Bio,
    decimal TotalPaid,
    bool IsBanned
);
