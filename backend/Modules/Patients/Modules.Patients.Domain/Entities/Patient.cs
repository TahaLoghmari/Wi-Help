using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public EmergencyContact EmergencyContact { get; private set; } = null!;
    public MedicalInfo MedicalInfo { get; private set; } = null!; 
    public string? Bio { get; private set; } 

    private Patient() { } 

    public Patient (
        Guid userId,
        EmergencyContact contact)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        EmergencyContact = contact;
        MedicalInfo = new MedicalInfo(new List<string>(), new List<string>(), new List<string>(), MobilityStatus.Normal);
        Bio = "";
    }
    
    public void Update(
        EmergencyContact? emergencyContact = null,
        MedicalInfo? medicalInfo = null,
        string? bio = null)
    {
        if (emergencyContact != null)
            EmergencyContact = emergencyContact;
        if (medicalInfo != null)
            MedicalInfo = medicalInfo;
        if ( bio != null )
            Bio = bio;
    }
}

