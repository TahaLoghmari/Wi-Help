namespace Modules.Patients.PublicApi.Contracts;

public record PatientDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string ProfilePictureUrl,
    string DateOfBirth,
    string Gender
);
