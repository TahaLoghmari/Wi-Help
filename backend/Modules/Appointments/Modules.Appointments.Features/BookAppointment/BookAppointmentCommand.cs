using Modules.Appointments.Domain.Enums;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.BookAppointment;

public record BookAppointmentCommand(
    Guid PatientId,
    Guid ProfessionalId,
    DateTime StartDate,
    DateTime EndDate,
    decimal Price,
    AppointmentUrgency Urgency,
    string? Notes) : ICommand;