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
    
    // Patient's professionals list
    public const string GetMyProfessionals = "appointments/me/professionals";
    
    // Respond to specific appointment (accept/reject/cancel)
    public const string RespondToAppointment = "appointments/{appointmentId}/respond";
    
    // Get specific appointment details
    public const string GetAppointmentById = "appointments/{appointmentId}";
    
    // Cancel appointment (patient)
    public const string CancelAppointment = "appointments/{appointmentId}/cancel";
    
    // Cancel appointment (professional)
    public const string CancelAppointmentByProfessional = "appointments/{appointmentId}/cancel-by-professional";
    
    // Complete appointment with prescription (professional)
    public const string CompleteAppointment = "appointments/{appointmentId}/complete";
    
    // Prescriptions
    public const string GetPatientPrescriptions = "appointments/patient/me/prescriptions";
    public const string GetPrescriptionById = "appointments/prescriptions/{prescriptionId}";
    
    // Admin endpoints
    public const string GetAllAppointmentsForAdmin = "appointments/admin/all";
    public const string UpdateAppointmentStatusByAdmin = "appointments/{appointmentId}/admin/status";
}
