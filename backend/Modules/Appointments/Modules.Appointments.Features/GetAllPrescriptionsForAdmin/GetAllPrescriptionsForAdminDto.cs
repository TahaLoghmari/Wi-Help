namespace Modules.Appointments.Features.GetAllPrescriptionsForAdmin;

public sealed record PrescriptionAdminDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    string PatientProfilePicture,
    Guid ProfessionalId,
    string ProfessionalName,
    string ProfessionalProfilePicture,
    string Title,
    DateTime Date,
    string? PrescriptionUrl
);
