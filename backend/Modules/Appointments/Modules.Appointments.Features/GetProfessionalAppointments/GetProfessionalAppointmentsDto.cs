using Modules.Appointments.Domain.Enums;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public record GetProfessionalAppointmentsDto( 
    Guid Id,
    Guid PatientId,
    Guid ProfessionalId,
    string? Notes,
    DateTime StartDate,
    DateTime EndDate,
    AppointmentUrgency Urgency,
    AppointmentStatus Status,
    decimal Price,
    DateTime? OfferedAt,
    DateTime? ConfirmedAt,
    DateTime? CompletedAt,
    DateTime? CancelledAt,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    PatientDto Patient);