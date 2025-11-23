using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.ValueObjects;

public class MedicalInfo
{
    public List<string> ChronicConditions { get; set; } = new List<string>();
    public List<string> Allergies { get; set; } = new List<string>();
    public List<string> Medications { get; set; } = new List<string>();
    public MobilityStatus MobilityStatus { get; set; } = MobilityStatus.Normal;
}    
