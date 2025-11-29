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

    // these are overriden lifecycle methods
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

    // Hub methods = exposed RPC endpoints clients can call. Not needed unless you need the client to push notifications to the server.
    public async Task SendNotification(string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", message);
    }
}