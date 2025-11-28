using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Notifications.Features.GetNotifications;

public sealed record GetNotificationsQuery(string UserId, int Page, int PageSize) : IQuery<PaginationResultDto<GetNotificationsDto>>;