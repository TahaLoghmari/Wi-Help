using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Repositories;

namespace Modules.Notifications.Features.MarkNotificationAsRead;

public sealed class MarkNotificationAsReadCommandHandler(INotificationRepository notifications)
    : ICommandHandler<MarkNotificationAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationAsReadCommand command,
        CancellationToken cancellationToken)
    {
        var notification = await notifications.GetByIdAsync(
            command.Id,
            command.UserId,
            cancellationToken);

        if (notification is null)
        {
            return Result.Failure(NotificationErrors.NotFound(command.Id));
        }

        if (!notification.IsRead)
        {
            notification.MarkAsRead();
            await notifications.SaveChangesAsync(cancellationToken);
        }

        return Result.Success();
    }
}
