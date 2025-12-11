using Modules.Common.Features.Results;

namespace Modules.Messaging.Domain;

public static class MessagingErrors
{
    public static Error ConversationNotFound(Guid id) => Error.NotFound(
        "Messaging.ConversationNotFound",
        $"Conversation with ID '{id}' not found.");

    public static Error NotParticipant() => Error.Forbidden(
        "Messaging.NotParticipant",
        "You are not a participant in this conversation.");

    public static Error MessageNotFound(Guid id) => Error.NotFound(
        "Messaging.MessageNotFound",
        $"Message with ID '{id}' not found.");

    public static Error CannotDeleteMessage() => Error.Forbidden(
        "Messaging.CannotDeleteMessage",
        "You can only delete your own messages.");

    public static Error ParticipantNotFound(Guid id) => Error.NotFound(
        "Messaging.ParticipantNotFound",
        $"Participant with ID '{id}' not found.");
}
