namespace Modules.Patients.PublicApi.Contracts;

public record EmergencyContactDto(
    string FullName,
    string PhoneNumber,
    string Relationship
);
