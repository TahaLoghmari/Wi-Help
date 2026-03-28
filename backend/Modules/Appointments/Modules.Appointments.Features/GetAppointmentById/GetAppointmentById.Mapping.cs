using Modules.Appointments.Domain.Entities;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetAppointmentById;

public static class GetAppointmentByIdMapping
{
    public static GetAppointmentByIdDto ToDto(this Appointment appointment, PatientDto patient) =>
        new(
            appointment.Id,
            appointment.PatientId,
            appointment.ProfessionalId,
            appointment.Notes,
            appointment.StartDate,
            appointment.EndDate,
            appointment.Urgency,
            appointment.Status,
            appointment.Price,
            appointment.OfferedAt,
            appointment.ConfirmedAt,
            appointment.CompletedAt,
            appointment.CancelledAt,
            appointment.CreatedAt,
            appointment.UpdatedAt,
            patient
        );
}
