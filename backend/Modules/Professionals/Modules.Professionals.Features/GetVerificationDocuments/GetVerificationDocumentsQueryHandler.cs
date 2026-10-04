using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.GetVerificationDocuments;

public sealed class GetVerificationDocumentsQueryHandler(
    IProfessionalRepository repository,
    IVerificationDocumentRepository documentRepository,
    ILogger<GetVerificationDocumentsQueryHandler> logger) : IQueryHandler<GetVerificationDocumentsQuery, List<VerificationDocumentDto>>
{
    public async Task<Result<List<VerificationDocumentDto>>> Handle(
        GetVerificationDocumentsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving verification documents for UserId: {UserId}", query.UserId);

        var professional = await repository.FindByUserIdReadOnlyAsync(query.UserId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for UserId: {UserId}", query.UserId);
            return Result<List<VerificationDocumentDto>>.Failure(ProfessionalErrors.NotFound(query.UserId));
        }

        var documents = (await documentRepository.GetByProfessionalIdAsync(professional.Id, cancellationToken))
            .Select(vd => new VerificationDocumentDto(
                vd.Id,
                vd.Type,
                vd.DocumentUrl,
                vd.Status,
                vd.UploadedAt,
                vd.ReviewedAt))
            .ToList();

        logger.LogInformation("Found {Count} verification documents for ProfessionalId: {ProfessionalId}", 
            documents.Count, professional.Id);

        return Result<List<VerificationDocumentDto>>.Success(documents);
    }
}
