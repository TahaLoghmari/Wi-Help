using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Domain.Ports;

public interface IVerificationDocumentOperations
{
    Task<IReadOnlyList<VerificationDocument>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<VerificationDocument?> FindByProfessionalAndTypeAsync(Guid professionalId, DocumentType documentType, CancellationToken cancellationToken);
    Task<VerificationDocument?> FindByIdWithProfessionalAsync(Guid documentId, CancellationToken cancellationToken);
    void Add(VerificationDocument verificationDocument);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
