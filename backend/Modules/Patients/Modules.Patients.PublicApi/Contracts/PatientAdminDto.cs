namespace Modules.Patients.PublicApi.Contracts;

public sealed record PatientAdminDto(
    Guid Id,
    Guid UserId,
    string FirstName,
    string LastName,
    string? ProfilePictureUrl,
    string Email,
    string? PhoneNumber,
    int Age,
    string? Address,
    DateTime? LastAppointmentDate,
    decimal TotalPaid);
