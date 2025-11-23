namespace Modules.Patients.Features;

public static class PatientsEndpoints
{
    public const string RegisterPatient = "patients/register";
    public const string UpdatePatient = "patients/me";
    public const string GetCurrentPatient = "patients/me";
    // todo : maybe add prefix = patients/appointments/ ? 
    public const string GetProfessionalAvailability = $"professionals/{{professionalId}}/availability";
}
