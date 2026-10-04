using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Repositories;
using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

internal sealed class UpdateDocumentStatusHandler(
    IVerificationDocumentRepository repository,
    INotificationsModuleApi notificationsModuleApi)
    : ICommandHandler<UpdateDocumentStatusCommand>
{
    public async Task<Result> Handle(UpdateDocumentStatusCommand command, CancellationToken cancellationToken)
    {
        var document = await repository.FindByIdWithProfessionalAsync(command.DocumentId, cancellationToken);

        if (document is null)
        {
            return Result.Failure(new Error("Document.NotFound", "Verification document not found", ErrorType.NotFound));
        }

        document.UpdateStatus(command.Status);

        await repository.SaveChangesAsync(cancellationToken);

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
