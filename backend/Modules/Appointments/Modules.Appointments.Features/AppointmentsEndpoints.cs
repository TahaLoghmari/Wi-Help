namespace Modules.Appointments.Features;

public static class AppointmentsEndpoints
{
    // Patient's or Professional's own appointments
    public const string GetMyAppointments = "appointments/me";
    
    // Book appointment (patient booking with a professional)
    public const string BookAppointment = "appointments";
    
    // Professional's patients list
    public const string GetMyPatients = "appointments/me/patients";
    
    // Respond to specific appointment (accept/reject/cancel)
    public const string RespondToAppointment = "appointments/{appointmentId}/respond";
    
    // Get specific appointment details
    public const string GetAppointmentById = "appointments/{appointmentId}";
}
