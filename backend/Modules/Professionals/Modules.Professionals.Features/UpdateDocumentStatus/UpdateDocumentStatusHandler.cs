using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

internal sealed class UpdateDocumentStatusHandler(ProfessionalsDbContext dbContext)
    : ICommandHandler<UpdateDocumentStatusCommand>
{
    public async Task<Result> Handle(UpdateDocumentStatusCommand command, CancellationToken cancellationToken)
    {
        var document = await dbContext.VerificationDocuments
            .FirstOrDefaultAsync(d => d.Id == command.DocumentId, cancellationToken);

        if (document is null)
        {
            return Result.Failure(new Error("Document.NotFound", "Verification document not found", ErrorType.NotFound));
        }

        document.UpdateStatus(command.Status);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
