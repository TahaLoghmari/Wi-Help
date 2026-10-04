using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Repositories;

namespace Modules.Notifications.Features.MarkNotificationsAsRead;

public sealed class MarkNotificationsAsReadCommandHandler(INotificationRepository notifications)
    : ICommandHandler<MarkNotificationsAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationsAsReadCommand command,
        CancellationToken cancellationToken)
    {
        var unreadNotifications = await notifications.GetUnreadAsync(command.UserId, cancellationToken);

        if (unreadNotifications.Count == 0)
        {
            return Result.Failure(NotificationErrors.NoUnread());
        }

        foreach (var notification in unreadNotifications)
        {
            notification.MarkAsRead();
        }

        await notifications.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
