using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Ports;

using Modules.Notifications.PublicApi;
using Modules.Notifications.PublicApi.Contracts;

namespace Modules.Professionals.Features.UpdateAccountStatus;

internal sealed class UpdateAccountStatusCommandHandler(
    IProfessionalProfileOperations profileOperations,
    ILogger<UpdateAccountStatusCommandHandler> logger,
    INotificationsModuleApi notificationsModuleApi)
    : ICommandHandler<UpdateAccountStatusCommand>
{
    public async Task<Result> Handle(UpdateAccountStatusCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating account status for professional {ProfessionalId} to {Status}", request.ProfessionalId, request.Status);

        var professional = await profileOperations.FindByIdAsync(request.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            return Result.Failure(ProfessionalErrors.NotFound(request.ProfessionalId));
        }

        professional.UpdateVerificationStatus(request.Status);

        await profileOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Account status updated successfully for professional {ProfessionalId}", request.ProfessionalId);

        await notificationsModuleApi.AddNotificationAsync(
            professional.UserId.ToString(),
            "Professional",
            "Account Status Updated",
            $"Your account status has been updated to {request.Status}.",
            NotificationType.accountStatusUpdated,
            cancellationToken);

        return Result.Success();
    }

}
