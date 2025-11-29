using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure.Jobs;

/// <summary>
/// Background job that automatically marks messages as delivered when recipients are online
/// </summary>
public class MessageStatusUpdateJob
{
    private readonly MessagingDbContext _messagingDbContext;
    private readonly ConnectionTracker _connectionTracker;
    private readonly ILogger<MessageStatusUpdateJob> _logger;

    public MessageStatusUpdateJob(
        MessagingDbContext messagingDbContext,
        ConnectionTracker connectionTracker,
        ILogger<MessageStatusUpdateJob> logger)
    {
        _messagingDbContext = messagingDbContext;
        _connectionTracker = connectionTracker;
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

        // Find all sent messages where the recipient is online
        var messagesToDeliver = await _messagingDbContext.Messages
            .Include(m => m.Conversation)
            .Where(m =>
                m.Status == MessageStatus.Sent &&
                !m.IsDeleted &&
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
    }
}

