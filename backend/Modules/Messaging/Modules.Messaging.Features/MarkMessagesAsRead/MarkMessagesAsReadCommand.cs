using Modules.Common.Features.Abstractions;

namespace Modules.Messaging.Features.MarkMessagesAsRead;

public record MarkMessagesAsReadCommand(
    Guid ConversationId,
    Guid UserId
) : ICommand;

