using Modules.Appointments.Domain.Entities;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public static class GetProfessionalAppointmentsMapping
{
    public static GetProfessionalAppointmentsDto ToDto(this Appointment appointment, Dictionary<Guid, PatientDto> patientsMap)
    {
        patientsMap.TryGetValue(appointment.PatientId, out var patient);

        return new GetProfessionalAppointmentsDto(
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
            patient!
        );
    }
}