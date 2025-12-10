namespace Modules.Professionals.Features.GetVerificationDocumentsForAdmin;

public record VerificationDocumentAdminDto(
    Guid Id,
    string Type,
    string Url,
    string Status
);

public record ProfessionalVerificationDto(
    Guid ProfessionalId,
    string Name,
    string ProfilePicture,
    string AccountStatus,
    List<VerificationDocumentAdminDto> Documents
);
