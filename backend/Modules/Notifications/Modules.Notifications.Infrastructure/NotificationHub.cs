using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Modules.Notifications.Infrastructure;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        _logger.LogInformation("SignalR client connected. UserId: {UserId}, ConnectionId: {ConnectionId}", 
            userId, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (exception != null)
        {
            _logger.LogWarning(exception, "SignalR client disconnected with error. UserId: {UserId}, ConnectionId: {ConnectionId}", 
                userId, Context.ConnectionId);
        }
        else
        {
            _logger.LogInformation("SignalR client disconnected. UserId: {UserId}, ConnectionId: {ConnectionId}", 
                userId, Context.ConnectionId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}