using Modules.Common.Features.Abstractions;

namespace Modules.Messaging.Features.CreateConversation;

public record CreateConversationCommand(
    Guid Participant1Id,
    Guid Participant2Id
) : ICommand;

