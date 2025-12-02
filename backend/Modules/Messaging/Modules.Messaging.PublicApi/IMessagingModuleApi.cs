using Modules.Common.Features.Results;

namespace Modules.Messaging.PublicApi;

/// <summary>
/// Public API for inter-module communication with the Messaging module.
/// Used by other modules to create conversations programmatically (e.g., after appointment acceptance).
/// </summary>
public interface IMessagingModuleApi
{
    /// <summary>
    /// Creates a conversation between two participants. Returns existing conversation ID if one already exists.
    /// </summary>
    Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default);
}

