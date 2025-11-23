namespace Modules.Patients.Domain.ValueObjects;

public record EmergencyContact
{
    public string FullName { get; } = string.Empty;
    public string PhoneNumber { get; } = string.Empty;
    public string Relationship { get; } = string.Empty;

    private EmergencyContact() { }

    public EmergencyContact(
        string fullName,
        string phoneNumber,
        string relationship)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Relationship = relationship;
    }
}