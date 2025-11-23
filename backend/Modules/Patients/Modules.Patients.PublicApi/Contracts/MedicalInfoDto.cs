namespace Modules.Patients.PublicApi.Contracts;

public record MedicalInfoDto(
    List<string> ChronicConditions,
    List<string> Allergies,
    List<string> Medications,
    string MobilityStatus
);
