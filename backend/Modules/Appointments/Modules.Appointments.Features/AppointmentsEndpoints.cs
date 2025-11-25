namespace Modules.Appointments.Features;

public static class AppointmentsEndpoints
{
    public const string GetAppointments = "appointments";
    public const string GetPatientAppointments = "appointments/patient/{patientId}";
    public const string GetProfessionalAppointments = "appointments/professional/{professionalId}";
    public const string GetProfessionalPatients = "appointments/my-patients";
    public const string BookAppointment = "appointments/book";
    public const string RespondToAppointment = "appointments/respond";
}
