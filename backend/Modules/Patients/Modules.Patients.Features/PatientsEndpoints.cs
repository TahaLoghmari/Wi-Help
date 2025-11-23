namespace Modules.Patients.Features;

public static class PatientsEndpoints
{
    public const string RegisterPatient = "patients/register";
    public const string UpdatePatient = "patients/me";
    public const string GetCurrentPatient = "patients/me";
    public const string GetPatient = "patients/{patientId}";
    // todo : maybe add prefix = patients/appointments/ ? 
    public const string GetProfessionalAvailability = $"professionals/{{professionalId}}/availability";
    public const string BookAppointment = "patients/appointments/book";
}
