using Modules.Appointments.Domain.Entities;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientAppointments;

public static class GetPatientAppointmentsMapping
{
    public static GetPatientAppointmentsDto ToDto(this Appointment appointment, Dictionary<Guid, ProfessionalDto> professionalsMap)
    {
        var professionalName = $"Professional {appointment.ProfessionalId.ToString().Substring(0, 8)}";
        string? professionalPictureUrl = null;
        string? professionalDateOfBirth = null;

        if (professionalsMap.TryGetValue(appointment.ProfessionalId, out var professional))
        {
            professionalName = $"{professional.FirstName} {professional.LastName}";
            professionalPictureUrl = professional.ProfilePictureUrl;
            professionalDateOfBirth = professional.DateOfBirth;
        }

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
            professionalName,
            professionalPictureUrl,
            professionalDateOfBirth
        );
    }
}