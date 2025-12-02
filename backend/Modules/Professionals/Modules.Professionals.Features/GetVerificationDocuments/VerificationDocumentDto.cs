using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Features.GetVerificationDocuments;

public sealed record VerificationDocumentDto(
    Guid Id,
    DocumentType Type,
    string DocumentUrl,
    DocumentStatus Status,
    DateTime UploadedAt,
    DateTime? ReviewedAt);
