using Modules.Appointments.Domain.Entities;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientAppointments;

public static class GetPatientAppointmentsMapping
{
    public static GetPatientAppointmentsDto ToDto(this Appointment appointment, Dictionary<Guid, ProfessionalDto> professionalsMap)
    {
        professionalsMap.TryGetValue(appointment.ProfessionalId, out var professional);

        return new GetPatientAppointmentsDto(
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
            professional!
        );
    }
}