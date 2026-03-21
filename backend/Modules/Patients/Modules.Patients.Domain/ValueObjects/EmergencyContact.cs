namespace Modules.Patients.Domain.ValueObjects;
public record EmergencyContact
{
    public string FullName { get; } = string.Empty;
    public string PhoneNumber { get; } = string.Empty;
    public Guid? RelationshipId { get; }

    private EmergencyContact() { }

    public EmergencyContact(
        string fullName = "",
        string phoneNumber = "",
        Guid? relationshipId = null)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        RelationshipId = relationshipId;
    }
}