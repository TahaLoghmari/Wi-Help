using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Infrastructure.Services;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Infrastructure;

[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;
    private readonly ConnectionTracker _connectionTracker;
    private readonly IConversationAccessService _conversationAccessService;

    public ChatHub(
        ILogger<ChatHub> logger, 
        ConnectionTracker connectionTracker,
        IConversationAccessService conversationAccessService)
    {
        _logger = logger;
        _connectionTracker = connectionTracker;
        _conversationAccessService = conversationAccessService;
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

        // Check if this is the user's first connection (they were offline before)
        var wasOffline = !_connectionTracker.IsUserOnline(userId);
        
        _connectionTracker.AddConnection(userId, Context.ConnectionId);
        
        _logger.LogInformation("ChatHub client connected. UserId: {UserId}, ConnectionId: {ConnectionId}", 
            userId, Context.ConnectionId);

        // Join user's personal group for direct notifications
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

        // Send the current list of online users to the newly connected client
        var onlineUserIds = _connectionTracker.GetOnlineUserIds();
        await Clients.Caller.SendAsync("OnlineUsers", onlineUserIds);

        // Notify others that this user is now online (only if they were offline before)
        if (wasOffline)
        {
            await Clients.Others.SendAsync("UserOnline", userId);
        }

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

        if (!Guid.TryParse(conversationId, out var conversationGuid))
        {
            await Clients.Caller.SendAsync("Error", "Invalid conversation ID");
            return;
        }

        // Verify user is a participant in this conversation
        var isParticipant = await _conversationAccessService.IsUserParticipantAsync(
            conversationGuid, 
            Guid.Parse(userId));

        if (!isParticipant)
        {
            _logger.LogWarning("User {UserId} attempted to join conversation {ConversationId} they are not a participant of",
                userId, conversationId);
            await Clients.Caller.SendAsync("Error", "Access denied");
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

        if (!Guid.TryParse(conversationId, out var conversationGuid))
        {
            return;
        }

        // Verify user is a participant (prevents spoofing typing indicators)
        var isParticipant = await _conversationAccessService.IsUserParticipantAsync(
            conversationGuid, 
            Guid.Parse(userId));

        if (!isParticipant)
        {
            _logger.LogWarning("User {UserId} attempted to send typing indicator to conversation {ConversationId} they are not a participant of",
                userId, conversationId);
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

        if (!Guid.TryParse(conversationId, out var conversationGuid))
        {
            return;
        }

        // Verify user is a participant (prevents spoofing typing indicators)
        var isParticipant = await _conversationAccessService.IsUserParticipantAsync(
            conversationGuid, 
            Guid.Parse(userId));

        if (!isParticipant)
        {
            return;
        }

        await Clients.GroupExcept($"conversation_{conversationId}", Context.ConnectionId)
            .SendAsync("UserStoppedTyping", conversationId, userId);
    }

    /// <summary>
    /// Get the list of currently online users.
    /// Useful for syncing state after reconnection.
    /// </summary>
    public async Task GetOnlineUsers()
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }

        var onlineUserIds = _connectionTracker.GetOnlineUserIds();
        await Clients.Caller.SendAsync("OnlineUsers", onlineUserIds);
    }
}

