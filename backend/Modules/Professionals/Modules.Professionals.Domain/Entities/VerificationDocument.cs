namespace Modules.Professionals.Domain.Entities;

public enum DocumentType
{
    Diploma,
    ProfessionalLicense,
    Id,
    Insurance
}

public enum DocumentStatus
{
    Pending,
    Verified,
    Rejected
}

public class VerificationDocument
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public DocumentType Type { get; private set; }
    public string DocumentUrl { get; private set; } = string.Empty;
    public DocumentStatus Status { get; private set; }
    public DateTime UploadedAt { get; private set; }
    public DateTime? ReviewedAt { get; private set; }
    public Professional Professional { get; private set; } = null!;

    private VerificationDocument() { }

    public VerificationDocument(
        Guid professionalId,
        DocumentType type,
        string documentUrl)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        Type = type;
        DocumentUrl = documentUrl;
        Status = DocumentStatus.Pending;
        UploadedAt = DateTime.UtcNow;
    }

    public void UpdateDocument(string documentUrl)
    {
        DocumentUrl = documentUrl;
        Status = DocumentStatus.Pending;
        UploadedAt = DateTime.UtcNow;
        ReviewedAt = null;
    }

    public void UpdateStatus(DocumentStatus status)
    {
        Status = status;
        ReviewedAt = DateTime.UtcNow;
    }
}
