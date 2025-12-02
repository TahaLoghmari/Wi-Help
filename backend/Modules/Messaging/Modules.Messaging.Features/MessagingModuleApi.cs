using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Results;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Features;

/// <summary>
/// Implementation of the public API for inter-module communication.
/// Provides methods for other modules to interact with the Messaging module.
/// </summary>
public class MessagingModuleApi(
    MessagingDbContext messagingDbContext) : IMessagingModuleApi
{
    public async Task<Result<Guid>> CreateConversationAsync(
        Guid participant1Id,
        Guid participant2Id,
        CancellationToken cancellationToken = default)
    {
        // Check if conversation already exists
        var existingConversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c =>
                (c.Participant1Id == participant1Id && c.Participant2Id == participant2Id) ||
                (c.Participant1Id == participant2Id && c.Participant2Id == participant1Id),
                cancellationToken);

        if (existingConversation != null)
        {
            return Result<Guid>.Success(existingConversation.Id);
        }

        var conversation = new Domain.Entities.Conversation(
            participant1Id,
            participant2Id,
            Domain.Enums.ConversationType.ProfessionalPatient);

        messagingDbContext.Conversations.Add(conversation);
        await messagingDbContext.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(conversation.Id);
    }
}

