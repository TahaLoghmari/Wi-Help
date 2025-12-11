using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;
using Modules.Notifications.PublicApi;
using Modules.Notifications.Domain.Enums;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

internal sealed class UpdateDocumentStatusHandler(
    ProfessionalsDbContext dbContext,
    INotificationsModuleApi notificationsModuleApi)
    : ICommandHandler<UpdateDocumentStatusCommand>
{
    public async Task<Result> Handle(UpdateDocumentStatusCommand command, CancellationToken cancellationToken)
    {
        var document = await dbContext.VerificationDocuments
            .Include(d => d.Professional)
            .FirstOrDefaultAsync(d => d.Id == command.DocumentId, cancellationToken);

        if (document is null)
        {
            return Result.Failure(new Error("Document.NotFound", "Verification document not found", ErrorType.NotFound));
        }

        document.UpdateStatus(command.Status);

        await dbContext.SaveChangesAsync(cancellationToken);

        await notificationsModuleApi.AddNotificationAsync(
            document.Professional.UserId.ToString(),
            "Professional",
            "Document Status Updated",
            $"Your {document.Type} status has been updated to {command.Status}.",
            NotificationType.documentStatusUpdated,
            cancellationToken);

        return Result.Success();
    }
}
