using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure.Jobs;
public class MessageStatusUpdateJob
{
    private readonly MessagingDbContext _messagingDbContext;
    private readonly ConnectionTracker _connectionTracker;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly ILogger<MessageStatusUpdateJob> _logger;

    public MessageStatusUpdateJob(
        MessagingDbContext messagingDbContext,
        ConnectionTracker connectionTracker,
        IHubContext<ChatHub> hubContext,
        ILogger<MessageStatusUpdateJob> logger)
    {
        _messagingDbContext = messagingDbContext;
        _connectionTracker = connectionTracker;
        _hubContext = hubContext;
        _logger = logger;
    }

    [AutomaticRetry(Attempts = 3)]
    public async Task MarkMessagesAsDeliveredForOnlineUsers(CancellationToken cancellationToken = default)
    {
        var onlineUserIds = _connectionTracker.GetOnlineUserIds()
            .Select(Guid.Parse)
            .ToList();

        if (onlineUserIds.Count == 0)
        {
            return;
        }

        var messagesToDeliver = await _messagingDbContext.Messages
            .Include(m => m.Conversation)
            .Where(m =>
                m.Status == MessageStatus.Sent &&
                m.DeletedAt == null &&
                onlineUserIds.Contains(m.Conversation.Participant1Id == m.SenderId
                    ? m.Conversation.Participant2Id
                    : m.Conversation.Participant1Id))
            .ToListAsync(cancellationToken);

        if (messagesToDeliver.Count == 0)
        {
            return;
        }

        foreach (var message in messagesToDeliver)
        {
            message.MarkAsDelivered();
        }

        await _messagingDbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Marked {Count} messages as delivered for online users", messagesToDeliver.Count);

        var notifications = messagesToDeliver
            .GroupBy(m => new { m.SenderId, m.ConversationId })
            .Select(g => new { g.Key.SenderId, g.Key.ConversationId });

        foreach (var n in notifications)
        {
            try
            {
                await _hubContext.Clients.Group($"user_{n.SenderId}")
                    .SendAsync("MessagesDelivered", new
                    {
                        ConversationId = n.ConversationId,
                        DeliveredBy = messagesToDeliver
                            .First(m => m.SenderId == n.SenderId && m.ConversationId == n.ConversationId)
                            .Conversation.GetOtherParticipant(n.SenderId)
                    }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex,
                    "Failed to send MessagesDelivered SignalR event to sender {SenderId} for conversation {ConversationId}",
                    n.SenderId, n.ConversationId);
            }
        }
    }
}

