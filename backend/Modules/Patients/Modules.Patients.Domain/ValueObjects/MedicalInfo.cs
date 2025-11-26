using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.ValueObjects;

public record MedicalInfo
{
    public List<string>? ChronicConditions { get; set; }
    public List<string>? Allergies { get; set; }
    public List<string>? Medications { get; set; }
    public MobilityStatus? MobilityStatus { get; set; } 
    
    private MedicalInfo() { }

    public MedicalInfo(
        List<string>? chronicConditions,
        List<string>? allergies,
        List<string>? medications,
        MobilityStatus? mobilityStatus)
    {
        ChronicConditions = chronicConditions;
        Allergies = allergies;
        Medications = medications;
        MobilityStatus = mobilityStatus;
    }
}    
