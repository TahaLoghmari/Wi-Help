using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.Services;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.UploadVerificationDocument;

public sealed class UploadVerificationDocumentCommandHandler(
    ProfessionalsDbContext dbContext,
    IFileStorage fileStorage,
    ILogger<UploadVerificationDocumentCommandHandler> logger) : ICommandHandler<UploadVerificationDocumentCommand>
{
    private const long MaxDocumentSizeInBytes = 10 * 1024 * 1024;

    public async Task<Result> Handle(
        UploadVerificationDocumentCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Uploading verification document for UserId: {UserId}, Type: {Type}", 
            command.UserId, command.DocumentType);

        if (!Enum.IsDefined(command.DocumentType))
        {
            return Result.Failure(ProfessionalErrors.InvalidVerificationDocument("The document type is invalid."));
        }

        if (command.Document.Length is 0 or > MaxDocumentSizeInBytes)
        {
            return Result.Failure(ProfessionalErrors.InvalidVerificationDocument("The document must be between 1 byte and 10 MB."));
        }

        if (!string.Equals(Path.GetExtension(command.Document.FileName), ".pdf", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(command.Document.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure(ProfessionalErrors.InvalidVerificationDocument("Only PDF documents are allowed."));
        }

        await using (var stream = command.Document.OpenReadStream())
        {
            var signature = new byte[5];
            var bytesRead = await stream.ReadAsync(signature, cancellationToken);
            if (bytesRead != signature.Length || !signature.SequenceEqual("%PDF-"u8.ToArray()))
            {
                return Result.Failure(ProfessionalErrors.InvalidVerificationDocument("The document content is not a valid PDF."));
            }
        }

        var professional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for UserId: {UserId}", command.UserId);
            return Result.Failure(ProfessionalErrors.NotFound(command.UserId));
        }

        var documentUrl = await fileStorage.UploadFileAsync(
            command.Document,
            $"{command.DocumentType}_{professional.Id}",
            "verification-documents",
            cancellationToken);

        var existingDocument = await dbContext.VerificationDocuments
            .FirstOrDefaultAsync(vd => vd.ProfessionalId == professional.Id && vd.Type == command.DocumentType, 
                cancellationToken);

        if (existingDocument is not null)
        {
            existingDocument.UpdateDocument(documentUrl);
            logger.LogInformation("Updated existing verification document for ProfessionalId: {ProfessionalId}, Type: {Type}", 
                professional.Id, command.DocumentType);
        }
        else
        {
            var newDocument = new VerificationDocument(
                professional.Id,
                command.DocumentType,
                documentUrl);
            
            dbContext.VerificationDocuments.Add(newDocument);
            logger.LogInformation("Created new verification document for ProfessionalId: {ProfessionalId}, Type: {Type}", 
                professional.Id, command.DocumentType);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
