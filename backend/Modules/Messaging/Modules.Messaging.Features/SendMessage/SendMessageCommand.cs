using Modules.Common.Features.Abstractions;

namespace Modules.Messaging.Features.SendMessage;

public record SendMessageCommand(
    Guid ConversationId,
    Guid SenderId,
    string Content
) : ICommand;

