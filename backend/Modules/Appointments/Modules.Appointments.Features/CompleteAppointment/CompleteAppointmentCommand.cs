using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.CompleteAppointment;

public record CompleteAppointmentCommand(
    Guid AppointmentId,
    Guid ProfessionalId,
    IFormFile PrescriptionPdf,
    string? PrescriptionTitle,
    string? PrescriptionNotes
) : ICommand;
