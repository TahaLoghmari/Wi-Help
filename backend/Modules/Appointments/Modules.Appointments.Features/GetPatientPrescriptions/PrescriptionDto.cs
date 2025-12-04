namespace Modules.Appointments.Features.GetPatientPrescriptions;

public record PrescriptionDto
{
    public Guid Id { get; init; }
    public Guid AppointmentId { get; init; }
    public Guid PatientId { get; init; }
    public Guid ProfessionalId { get; init; }
    public string PdfUrl { get; init; } = string.Empty;
    public string? Title { get; init; }
    public string? Notes { get; init; }
    public DateTime IssuedAt { get; init; }
    public DateTime CreatedAt { get; init; }
    public ProfessionalInfoDto? Professional { get; init; }
}

public record ProfessionalInfoDto
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? ProfilePictureUrl { get; init; }
    public string? Specialization { get; init; }
}
