namespace Modules.Patients.Features;

public static class PatientsEndpoints
{
    public const string RegisterPatient = "patients/register";
    public const string UpdatePatient = "patients/me";
    public const string GetCurrentPatient = "patients/me";
    public const string GetPatient = "patients/{patientId}";
    public const string GetAllPatients = "patients/admin";
    public const string CompleteOnboarding = "patients/complete-onboarding";
}
