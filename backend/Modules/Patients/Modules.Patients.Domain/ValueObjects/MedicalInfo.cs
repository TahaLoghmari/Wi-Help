using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.ValueObjects;

public class MedicalInfo
{
    public List<string>? ChronicConditions { get; set; }
    public List<string>? Allergies { get; set; }
    public List<string>? Medications { get; set; }
    public MobilityStatus? MobilityStatus { get; set; } 
    
    // Parameterless constructor for EF Core and model binding
    public MedicalInfo() 
    { 
    }

    // Factory method for creating new instances
    public static MedicalInfo Create(
        List<string>? chronicConditions,
        List<string>? allergies,
        List<string>? medications,
        MobilityStatus? mobilityStatus)
    {
        return new MedicalInfo
        {
            ChronicConditions = chronicConditions,
            Allergies = allergies,
            Medications = medications,
            MobilityStatus = mobilityStatus
        };
    }
}

