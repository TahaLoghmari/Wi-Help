using Modules.Common.Features.Abstractions;

namespace Modules.Messaging.Features.DeleteMessage;

public record DeleteMessageCommand(
    Guid MessageId,
    Guid UserId
) : ICommand;

