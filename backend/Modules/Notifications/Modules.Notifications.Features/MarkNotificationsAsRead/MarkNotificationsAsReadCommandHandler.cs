using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Features.MarkNotificationsAsRead;

public sealed class MarkNotificationsAsReadCommandHandler(NotificationsDbContext dbContext)
    : ICommandHandler<MarkNotificationsAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationsAsReadCommand command,
        CancellationToken cancellationToken)
    {
        var notifications = await dbContext.Notifications
            .Where(n => n.UserId == command.UserId && !n.IsRead)
            .ToListAsync(cancellationToken);

        if (notifications.Count == 0)
        {
            return Result.Failure(NotificationErrors.NoUnread());
        }

        foreach (var notification in notifications)
        {
            notification.MarkAsRead();
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}