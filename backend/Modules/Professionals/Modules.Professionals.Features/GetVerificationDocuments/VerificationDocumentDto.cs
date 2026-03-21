using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.GetVerificationDocuments;

public sealed record VerificationDocumentDto(
    Guid Id,
    DocumentType Type,
    string DocumentUrl,
    DocumentStatus Status,
    DateTime UploadedAt,
    DateTime? ReviewedAt);
