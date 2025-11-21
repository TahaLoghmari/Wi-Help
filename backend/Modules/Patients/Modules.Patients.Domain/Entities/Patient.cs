using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public EmergencyContact EmergencyContact { get; private set; } = null!;

    private Patient() { } 

    public Patient (
        Guid userId,
        EmergencyContact contact)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        EmergencyContact = contact;

    }
    
    public void Update(EmergencyContact? emergencyContact = null)
    {
        if (emergencyContact != null)
            EmergencyContact = emergencyContact;
    }
}
