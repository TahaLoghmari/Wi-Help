namespace Modules.Professionals.Features;

public static class ProfessionalsEndpoints
{
    public const string RegisterProfessional = "professionals/register";
    public const string UpdateProfessional = "professionals/me";
    public const string GetCurrentProfessional = "professionals/me";
    public const string GetProfessionalById = "professionals/{id}";
    public const string SetupSchedule = "professionals/schedule";
    public const string GetSchedule = "professionals/schedule";
    public const string GetAllProfessionals = "professionals";
    public const string RespondToAppointment = "professionals/appointments/respond";
}
