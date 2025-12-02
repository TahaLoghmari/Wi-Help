using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Features.GetVerificationDocuments;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.GetProfessionalDocuments;

public sealed class GetProfessionalDocumentsQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetProfessionalDocumentsQueryHandler> logger) : IQueryHandler<GetProfessionalDocumentsQuery, List<VerificationDocumentDto>>
{
    public async Task<Result<List<VerificationDocumentDto>>> Handle(
        GetProfessionalDocumentsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving verification documents for ProfessionalId: {ProfessionalId}", query.ProfessionalId);

        var professional = await dbContext.Professionals
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == query.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for ProfessionalId: {ProfessionalId}", query.ProfessionalId);
            return Result<List<VerificationDocumentDto>>.Failure(ProfessionalErrors.NotFound(query.ProfessionalId));
        }

        var documents = await dbContext.VerificationDocuments
            .AsNoTracking()
            .Where(vd => vd.ProfessionalId == professional.Id)
            .Select(vd => new VerificationDocumentDto(
                vd.Id,
                vd.Type,
                vd.DocumentUrl,
                vd.Status,
                vd.UploadedAt,
                vd.ReviewedAt))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} verification documents for ProfessionalId: {ProfessionalId}", 
            documents.Count, professional.Id);

        return Result<List<VerificationDocumentDto>>.Success(documents);
    }
}
