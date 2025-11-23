using Modules.Appointments.Domain.Enums;

namespace Modules.Appointments.Domain.Entities;

public class Appointment
{
    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Notes { get; private set; } = string.Empty;
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public AppointmentUrgency Urgency { get; private set; }
    public AppointmentStatus Status { get; private set; }
    public decimal Price { get; private set; }

    public DateTime? OfferedAt { get; private set; }
    public DateTime? ConfirmedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public DateTime? CancelledAt { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Appointment() { }

    public Appointment(
        Guid patientId,
        Guid professionalId,
        string notes,
        DateTime startDate,
        DateTime endDate,
        AppointmentUrgency urgency,
        decimal price)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        ProfessionalId = professionalId;
        Notes = notes;
        StartDate = startDate;
        EndDate = endDate;
        Urgency = urgency;
        Status = AppointmentStatus.Offered;
        Price = price;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
