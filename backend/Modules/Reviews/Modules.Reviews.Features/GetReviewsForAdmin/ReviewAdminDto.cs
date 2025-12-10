namespace Modules.Reviews.Features.GetReviewsForAdmin;

public sealed record ReviewAdminDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    string PatientProfilePicture,
    Guid ProfessionalId,
    string ProfessionalName,
    string ProfessionalProfilePicture,
    int Rating,
    string Description,
    DateTime Date
);
