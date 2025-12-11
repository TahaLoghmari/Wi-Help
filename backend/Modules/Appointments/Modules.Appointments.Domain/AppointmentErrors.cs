using Modules.Appointments.Domain.Enums;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Domain;

public static class AppointmentErrors
{
    public static Error AppointmentNotFound(Guid appointmentId) =>
        Error.NotFound(
            "Appointment.NotFound",
            $"The appointment with Id '{appointmentId}' was not found.");

    public static Error InvalidStatus(AppointmentStatus status, string action) =>
        Error.Problem(
            "Appointment.InvalidStatus",
            $"Appointment is in {status} status and cannot be {action}.");

    public static Error PrescriptionPdfRequired() =>
        Error.Validation(
            "Prescription.PdfRequired",
            "A prescription PDF file is required to complete the appointment.");

    public static Error InvalidPrescriptionFileType() =>
        Error.Validation(
            "Prescription.InvalidFileType",
            "Only PDF files are allowed for prescriptions.");

    public static Error PrescriptionUploadFailed() =>
        Error.Problem(
            "Prescription.UploadFailed",
            "Failed to upload the prescription PDF. Please try again.");
}
