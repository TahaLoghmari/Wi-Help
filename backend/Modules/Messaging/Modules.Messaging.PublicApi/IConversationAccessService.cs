namespace Modules.Messaging.PublicApi;

/// <summary>
/// Service for checking conversation access permissions.
/// Used by SignalR hub for authorization checks.
/// </summary>
public interface IConversationAccessService
{
    /// <summary>
    /// Checks if a user is a participant in the specified conversation.
    /// </summary>
    /// <param name="conversationId">The conversation ID to check.</param>
    /// <param name="userId">The user ID to verify.</param>
    /// <returns>True if the user is a participant, false otherwise.</returns>
    Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId);
}
