using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Notifications.Infrastructure.Database;

namespace Modules.Notifications.Features.GetNotifications;

public sealed class GetNotificationsQueryHandler(NotificationsDbContext dbContext)
    : IQueryHandler<GetNotificationsQuery, PaginationResultDto<GetNotificationsDto>>
{
    public async Task<Result<PaginationResultDto<GetNotificationsDto>>> Handle(
        GetNotificationsQuery query,
        CancellationToken cancellationToken)
    {
        IQueryable<GetNotificationsDto> notificationQuery = dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == query.UserId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new GetNotificationsDto(
                n.Id,
                n.Title,
                n.Message,
                n.Type,
                n.IsRead,
                n.CreatedAt));

        var paginationResult = await PaginationResultDto<GetNotificationsDto>.CreateAsync(
            notificationQuery, query.Page, query.PageSize, cancellationToken);

        return Result<PaginationResultDto<GetNotificationsDto>>.Success(paginationResult);
    }
}