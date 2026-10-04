using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Domain.Services;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure;

[Authorize]
public class ChatHub(
    ILogger<ChatHub> logger,
    ConnectionTracker connectionTracker,
    IConversationAccessService conversationAccessService) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("User connected without valid identifier. ConnectionId: {ConnectionId}", Context.ConnectionId);
            Context.Abort();
            return;
        }

        var isFirstConnection = connectionTracker.AddConnection(userId, Context.ConnectionId);
        logger.LogInformation("ChatHub client connected. UserId: {UserId}, ConnectionId: {ConnectionId}", userId, Context.ConnectionId);

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        await Clients.Caller.SendAsync("OnlineUsers", connectionTracker.GetOnlineUserIds());

        if (isFirstConnection)
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
            var isLastConnection = connectionTracker.RemoveConnection(userId, Context.ConnectionId);
            if (isLastConnection)
            {
                await Clients.Others.SendAsync("UserOffline", userId);
            }

            if (exception != null)
            {
                logger.LogWarning(exception,
                    "ChatHub client disconnected with error. UserId: {UserId}, ConnectionId: {ConnectionId}",
                    userId, Context.ConnectionId);
            }
            else
            {
                logger.LogInformation("ChatHub client disconnected. UserId: {UserId}, ConnectionId: {ConnectionId}",
                    userId, Context.ConnectionId);
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

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

        if (!Guid.TryParse(userId, out var userGuid))
        {
            await Clients.Caller.SendAsync("Error", "Unauthorized");
            return;
        }

        if (!await conversationAccessService.IsUserParticipantAsync(conversationGuid, userGuid))
        {
            logger.LogWarning("User {UserId} attempted to join conversation {ConversationId} they are not a participant of",
                userId, conversationId);
            await Clients.Caller.SendAsync("Error", "Access denied");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        logger.LogInformation("User {UserId} joined conversation {ConversationId}", userId, conversationId);
    }

    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        logger.LogInformation("User {UserId} left conversation {ConversationId}", Context.UserIdentifier, conversationId);
    }

    public async Task StartTyping(string conversationId)
    {
        if (!await IsAuthorizedForConversationAsync(conversationId, warnOnDenied: true))
            return;

        await Clients.GroupExcept($"conversation_{conversationId}", Context.ConnectionId)
            .SendAsync("UserTyping", conversationId, Context.UserIdentifier);
    }

    public async Task StopTyping(string conversationId)
    {
        if (!await IsAuthorizedForConversationAsync(conversationId, warnOnDenied: false))
            return;

        await Clients.GroupExcept($"conversation_{conversationId}", Context.ConnectionId)
            .SendAsync("UserStoppedTyping", conversationId, Context.UserIdentifier);
    }

    public async Task GetOnlineUsers()
    {
        if (!string.IsNullOrEmpty(Context.UserIdentifier))
        {
            await Clients.Caller.SendAsync("OnlineUsers", connectionTracker.GetOnlineUserIds());
        }
    }

    private async Task<bool> IsAuthorizedForConversationAsync(string conversationId, bool warnOnDenied)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId) ||
            !Guid.TryParse(conversationId, out var conversationGuid) ||
            !Guid.TryParse(userId, out var userGuid))
        {
            return false;
        }

        var isParticipant = await conversationAccessService.IsUserParticipantAsync(conversationGuid, userGuid);
        if (!isParticipant && warnOnDenied)
        {
            logger.LogWarning(
                "User {UserId} attempted to send a typing indicator to conversation {ConversationId} they are not a participant of",
                userId, conversationId);
        }

        return isParticipant;
    }
}
