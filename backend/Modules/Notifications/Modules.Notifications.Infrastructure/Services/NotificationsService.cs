using Microsoft.AspNetCore.SignalR;
using Modules.Notifications.Domain;
using Modules.Notifications.Infrastructure;

namespace Modules.Notifications.Infrastructure.Services;

public class NotificationsService(IHubContext<NotificationHub> hubContext)
{
    public async Task SendToUser(string userId, NotificationDto notificationDto)
    {
        await hubContext.Clients.User(userId).SendAsync("NotificationReceived", notificationDto);
    }
}