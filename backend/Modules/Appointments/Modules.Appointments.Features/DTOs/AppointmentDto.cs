using Modules.Appointments.Domain.Enums;

namespace Modules.Appointments.Features.DTOs;

public record AppointmentDto(
    Guid Id,
    Guid PatientId,
    Guid ProfessionalId,
    string Notes,
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
    string PatientName,
    string? PatientAvatar = null,
    DateTime? PatientDateOfBirth = null
);
