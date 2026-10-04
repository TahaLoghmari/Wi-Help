using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Enums;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Infrastructure.Database.Repositories;

internal sealed class VerificationDocumentRepository(ProfessionalsDbContext dbContext) : IVerificationDocumentRepository
{
    public async Task<IReadOnlyList<VerificationDocument>> GetByProfessionalIdAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.VerificationDocuments.AsNoTracking().Where(document => document.ProfessionalId == professionalId).ToListAsync(cancellationToken);

    public Task<VerificationDocument?> FindByProfessionalAndTypeAsync(Guid professionalId, DocumentType documentType, CancellationToken cancellationToken) =>
        dbContext.VerificationDocuments.FirstOrDefaultAsync(document => document.ProfessionalId == professionalId && document.Type == documentType, cancellationToken);

    public Task<VerificationDocument?> FindByIdWithProfessionalAsync(Guid documentId, CancellationToken cancellationToken) =>
        dbContext.VerificationDocuments.Include(document => document.Professional).FirstOrDefaultAsync(document => document.Id == documentId, cancellationToken);

    public void Add(VerificationDocument verificationDocument) => dbContext.VerificationDocuments.Add(verificationDocument);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
