using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Notifications.Domain;
using Modules.Notifications.Domain.Entities;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Features.MarkNotificationAsRead;

public sealed class MarkNotificationAsReadCommandHandler(NotificationsDbContext dbContext)
    : ICommandHandler<MarkNotificationAsReadCommand>
{
    public async Task<Result> Handle(
        MarkNotificationAsReadCommand command,
        CancellationToken cancellationToken)
    {
        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == command.Id && n.UserId == command.UserId, cancellationToken);

        if (notification is null)
        {
            return Result.Failure(NotificationErrors.NotFound(command.Id));
        }

        if (!notification.IsRead)
        {
            notification.MarkAsRead();
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Result.Success();
    }
}