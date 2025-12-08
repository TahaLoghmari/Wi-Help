using Modules.Common.Features.Results;

namespace Modules.Administration.Domain.Errors;

public static class AdministrationErrors
{
    public static Error ProfessionalNotFound() =>
        Error.NotFound("Administration.ProfessionalNotFound", "Professional not found.");

    public static Error PatientNotFound() =>
        Error.NotFound("Administration.PatientNotFound", "Patient not found.");

    public static Error AppointmentNotFound() =>
        Error.NotFound("Administration.AppointmentNotFound", "Appointment not found.");
}
