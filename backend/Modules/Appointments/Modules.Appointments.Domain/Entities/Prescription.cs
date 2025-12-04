namespace Modules.Appointments.Domain.Entities;

public class Prescription
{
    public Guid Id { get; private set; }
    public Guid AppointmentId { get; private set; }
    public Guid PatientId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string PdfUrl { get; private set; } = string.Empty;
    public string? Title { get; private set; }
    public string? Notes { get; private set; }
    public DateTime IssuedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Prescription() { }

    public Prescription(
        Guid appointmentId,
        Guid patientId,
        Guid professionalId,
        string pdfUrl,
        string? title = null,
        string? notes = null)
    {
        Id = Guid.NewGuid();
        AppointmentId = appointmentId;
        PatientId = patientId;
        ProfessionalId = professionalId;
        PdfUrl = pdfUrl;
        Title = title;
        Notes = notes;
        IssuedAt = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string? title, string? notes)
    {
        Title = title;
        Notes = notes;
        UpdatedAt = DateTime.UtcNow;
    }
}
