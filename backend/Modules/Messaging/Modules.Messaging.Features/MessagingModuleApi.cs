using Modules.Common.Features.Results;
using Modules.Messaging.Domain.Ports;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Features;

/// <summary>
/// Implementation of the public API for inter-module communication.
/// Provides methods for other modules to interact with the Messaging module.
/// </summary>
public class MessagingModuleApi(
    IConversationOperations conversationOperations) : IMessagingModuleApi
{
    public async Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default)
    {
        // Check if conversation already exists
        var existingConversation = await conversationOperations.FindAsync(participant1Id, participant2Id, cancellationToken);

        if (existingConversation != null)
        {
            return Result<Guid>.Success(existingConversation.Id);
        }

        var conversation = new Domain.Entities.Conversation(
            participant1Id,
            participant2Id,
            Domain.Enums.ConversationType.ProfessionalPatient);

        await conversationOperations.CreateAsync(conversation, cancellationToken);

        return Result<Guid>.Success(conversation.Id);
    }
}
