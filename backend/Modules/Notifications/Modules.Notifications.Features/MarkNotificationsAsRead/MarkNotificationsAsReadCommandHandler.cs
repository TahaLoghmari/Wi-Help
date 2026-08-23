using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Operations;

namespace Modules.Notifications.Features.MarkNotificationsAsRead;

public sealed class MarkNotificationsAsReadCommandHandler(IMarkNotificationsAsRead markNotificationsAsRead)
    : ICommandHandler<MarkNotificationsAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationsAsReadCommand command,
        CancellationToken cancellationToken)
    {
        bool markedNotifications = await markNotificationsAsRead.MarkAllAsync(command.UserId, cancellationToken);

        if (!markedNotifications)
        {
            return Result.Failure(NotificationErrors.NoUnread());
        }

        return Result.Success();
    }
}
