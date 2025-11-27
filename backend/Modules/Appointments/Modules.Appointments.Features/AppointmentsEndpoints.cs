namespace Modules.Appointments.Features;

public static class AppointmentsEndpoints
{
    // Patient's appointments (current signed-in patient)
    public const string GetPatientAppointments = "appointments/patient/me";
    
    // Professional's appointments (current signed-in professional)
    public const string GetProfessionalAppointments = "appointments/professional/me";
    
    // Book appointment (patient booking with a professional)
    public const string BookAppointment = "appointments";
    
    // Professional's patients list
    public const string GetMyPatients = "appointments/me/patients";
    
    // Respond to specific appointment (accept/reject/cancel)
    public const string RespondToAppointment = "appointments/{appointmentId}/respond";
    
    // Get specific appointment details
    public const string GetAppointmentById = "appointments/{appointmentId}";
}
