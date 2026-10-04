using Modules.Common.Features.Results;
using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Features;

/// <summary>
/// Implementation of the public API for inter-module communication.
/// Provides methods for other modules to interact with the Messaging module.
/// </summary>
public class MessagingModuleApi(
    IConversationRepository conversations) : IMessagingModuleApi
{
    public async Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default)
    {
        // Check if conversation already exists
        var existingConversation = await conversations.FindAsync(participant1Id, participant2Id, cancellationToken);

        if (existingConversation != null)
        {
            return Result<Guid>.Success(existingConversation.Id);
        }

        var conversation = new Domain.Entities.Conversation(
            participant1Id,
            participant2Id,
            Domain.Enums.ConversationType.ProfessionalPatient);

        conversations.Add(conversation);
        await conversations.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(conversation.Id);
    }
}
