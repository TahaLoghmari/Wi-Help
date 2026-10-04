using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Notifications.Domain.Repositories;

namespace Modules.Notifications.Features.GetNotifications;

public sealed class GetNotificationsQueryHandler(INotificationRepository notificationInbox)
    : IQueryHandler<GetNotificationsQuery, PaginationResultDto<GetNotificationsDto>>
{
    public async Task<Result<PaginationResultDto<GetNotificationsDto>>> Handle(
        GetNotificationsQuery query,
        CancellationToken cancellationToken)
    {
        var notificationPage = await notificationInbox.GetAsync(
            query.UserId,
            query.Page,
            query.PageSize,
            cancellationToken);
        var notifications = notificationPage.Items
            .Select(notification => new GetNotificationsDto(
                notification.Id,
                notification.Title,
                notification.Message,
                notification.Type,
                notification.IsRead,
                notification.CreatedAt))
            .ToList();
        var paginationResult = PaginationResultDto<GetNotificationsDto>.Create(
            notifications, query.Page, query.PageSize, notificationPage.TotalCount);

        return Result<PaginationResultDto<GetNotificationsDto>>.Success(paginationResult);
    }
}
