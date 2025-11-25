using Modules.Appointments.Domain.Entities;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public static class GetProfessionalAppointmentsMapping
{
    public static GetProfessionalAppointmentsDto ToDto(this Appointment appointment, Dictionary<Guid, PatientDto> patientsMap)
    {
        var patientName = $"Patient {appointment.PatientId.ToString().Substring(0, 8)}";
        string? patientAvatar = null;
        DateTime? patientDateOfBirth = null;

        if (patientsMap.TryGetValue(appointment.PatientId, out var patient))
        {
            patientName = $"{patient.FirstName} {patient.LastName}";
            patientAvatar = patient.ProfilePictureUrl;
            if (DateTime.TryParse(patient.DateOfBirth, out var dob))
            {
                patientDateOfBirth = dob;
            }
        }

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
            patientName,
            patientAvatar,
            patientDateOfBirth
        );
    }
}