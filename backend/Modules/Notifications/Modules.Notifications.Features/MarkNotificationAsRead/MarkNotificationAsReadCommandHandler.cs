using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Operations;

namespace Modules.Notifications.Features.MarkNotificationAsRead;

public sealed class MarkNotificationAsReadCommandHandler(IMarkNotificationAsRead markNotificationAsRead)
    : ICommandHandler<MarkNotificationAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationAsReadCommand command,
        CancellationToken cancellationToken)
    {
        bool notificationExists = await markNotificationAsRead.MarkAsync(
            command.Id,
            command.UserId,
            cancellationToken);

        if (!notificationExists)
        {
            return Result.Failure(NotificationErrors.NotFound(command.Id));
        }

        return Result.Success();
    }
}
