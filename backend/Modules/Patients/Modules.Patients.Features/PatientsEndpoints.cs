namespace Modules.Patients.Features;

public static class PatientsEndpoints
{
    public const string RegisterPatient = "patients/register";
    public const string UpdatePatient = "patients/me";
    public const string GetCurrentPatient = "patients/me";
    public const string GetPatient = "patients/{patientId}";
    public const string GetAllPatients = "patients/admin";
    public const string CompleteOnboarding = "patients/complete-onboarding";
    public const string GetRelationships = "relationships";
    public const string GetAllergies = "allergies";
    public const string GetConditions = "conditions";
    public const string GetMedications = "medications";
}
