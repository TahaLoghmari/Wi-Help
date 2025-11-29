using Modules.Common.Features.Abstractions;

namespace Modules.Messaging.Features.MarkMessagesAsDelivered;

public record MarkMessagesAsDeliveredCommand(
    Guid ConversationId,
    Guid UserId
) : ICommand;

