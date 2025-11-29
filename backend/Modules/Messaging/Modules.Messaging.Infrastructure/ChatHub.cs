using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure;

[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;
    private readonly ConnectionTracker _connectionTracker;

    public ChatHub(ILogger<ChatHub> logger, ConnectionTracker connectionTracker)
    {
        _logger = logger;
        _connectionTracker = connectionTracker;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("User connected without valid identifier. ConnectionId: {ConnectionId}", Context.ConnectionId);
            Context.Abort();
            return;
        }

        _connectionTracker.AddConnection(userId, Context.ConnectionId);
        
        _logger.LogInformation("ChatHub client connected. UserId: {UserId}, ConnectionId: {ConnectionId}", 
            userId, Context.ConnectionId);

        // Join user's personal group for direct notifications
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

        // Notify others that this user is now online
        await Clients.Others.SendAsync("UserOnline", userId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            _connectionTracker.RemoveConnection(userId, Context.ConnectionId);

            // Check if user is still online (has other connections)
            if (!_connectionTracker.IsUserOnline(userId))
            {
                // Notify others that this user is now offline
                await Clients.Others.SendAsync("UserOffline", userId);
            }

            if (exception != null)
            {
                _logger.LogWarning(exception, 
                    "ChatHub client disconnected with error. UserId: {UserId}, ConnectionId: {ConnectionId}", 
                    userId, Context.ConnectionId);
            }
            else
            {
                _logger.LogInformation("ChatHub client disconnected. UserId: {UserId}, ConnectionId: {ConnectionId}", 
                    userId, Context.ConnectionId);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Join a conversation group to receive real-time updates for that conversation
    /// </summary>
    public async Task JoinConversation(string conversationId)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("Error", "Unauthorized");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        _logger.LogInformation("User {UserId} joined conversation {ConversationId}", userId, conversationId);
    }

    /// <summary>
    /// Leave a conversation group
    /// </summary>
    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        var userId = Context.UserIdentifier;
        _logger.LogInformation("User {UserId} left conversation {ConversationId}", userId, conversationId);
    }

    /// <summary>
    /// Notify that user is typing in a conversation
    /// </summary>
    public async Task StartTyping(string conversationId)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }

        // Notify all other participants in the conversation
        await Clients.GroupExcept($"conversation_{conversationId}", Context.ConnectionId)
            .SendAsync("UserTyping", conversationId, userId);
    }

    /// <summary>
    /// Notify that user stopped typing in a conversation
    /// </summary>
    public async Task StopTyping(string conversationId)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }

        await Clients.GroupExcept($"conversation_{conversationId}", Context.ConnectionId)
            .SendAsync("UserStoppedTyping", conversationId, userId);
    }
}

