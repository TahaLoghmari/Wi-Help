using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.Entities;

public class Patient
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public EmergencyContact EmergencyContact { get; private set; } = null!;
    public MobilityStatus? MobilityStatus { get; private set; }
    public string? Bio { get; private set; } 
    public ICollection<Allergy> Allergies { get; private set; } = new List<Allergy>();
    public ICollection<Condition> Conditions { get; private set; } = new List<Condition>();
    public ICollection<Medication> Medications { get; private set; } = new List<Medication>();

    private Patient() { } 

    public Patient (
        Guid userId,
        EmergencyContact contact)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        EmergencyContact = contact;
        MobilityStatus = null;
        Bio = "";
    }
    
    public void Update(
        EmergencyContact? emergencyContact = null,
        MobilityStatus? mobilityStatus = null,
        string? bio = null)
    {
        if (emergencyContact != null)
            EmergencyContact = emergencyContact;
        if (mobilityStatus != null)
            MobilityStatus = mobilityStatus;
        if ( bio != null )
            Bio = bio;
    }

    public void UpdateAllergies(List<Allergy> newAllergies)
    {
        var newIds = newAllergies.Select(a => a.Id).ToHashSet();
        var currentIds = Allergies.Select(a => a.Id).ToHashSet();

        var toRemove = Allergies.Where(a => !newIds.Contains(a.Id)).ToList();
        foreach (var item in toRemove)
            Allergies.Remove(item);

        var toAdd = newAllergies.Where(a => !currentIds.Contains(a.Id));
        foreach (var item in toAdd)
            Allergies.Add(item);
    }

    public void UpdateConditions(List<Condition> newConditions)
    {
        var newIds = newConditions.Select(c => c.Id).ToHashSet();
        var currentIds = Conditions.Select(c => c.Id).ToHashSet();

        var toRemove = Conditions.Where(c => !newIds.Contains(c.Id)).ToList();
        foreach (var item in toRemove)
            Conditions.Remove(item);

        var toAdd = newConditions.Where(c => !currentIds.Contains(c.Id));
        foreach (var item in toAdd)
            Conditions.Add(item);
    }

    public void UpdateMedications(List<Medication> newMedications)
    {
        var newIds = newMedications.Select(m => m.Id).ToHashSet();
        var currentIds = Medications.Select(m => m.Id).ToHashSet();

        var toRemove = Medications.Where(m => !newIds.Contains(m.Id)).ToList();
        foreach (var item in toRemove)
            Medications.Remove(item);

        var toAdd = newMedications.Where(m => !currentIds.Contains(m.Id));
        foreach (var item in toAdd)
            Medications.Add(item);
    }
}

