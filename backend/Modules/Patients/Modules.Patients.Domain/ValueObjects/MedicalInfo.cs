using Modules.Patients.Domain.Enums;

namespace Modules.Patients.Domain.ValueObjects;

public class MedicalInfo
{
    public List<string>? ChronicConditions { get; set; }
    public List<string>? Allergies { get; set; }
    public List<string>? Medications { get; set; }
    public MobilityStatus MobilityStatus { get; set; } = MobilityStatus.Normal;
}    
