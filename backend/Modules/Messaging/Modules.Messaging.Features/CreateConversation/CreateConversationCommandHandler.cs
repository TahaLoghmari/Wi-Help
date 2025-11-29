using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.CreateConversation;

public class CreateConversationCommandHandler(
    MessagingDbContext messagingDbContext,
    ILogger<CreateConversationCommandHandler> logger) : ICommandHandler<CreateConversationCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateConversationCommand command, CancellationToken cancellationToken)
    {
        // Check if conversation already exists between these participants
        var existingConversation = await messagingDbContext.Conversations
            .FirstOrDefaultAsync(c =>
                (c.Participant1Id == command.Participant1Id && c.Participant2Id == command.Participant2Id) ||
                (c.Participant1Id == command.Participant2Id && c.Participant2Id == command.Participant1Id),
                cancellationToken);

        if (existingConversation != null)
        {
            logger.LogInformation("Conversation already exists between {Participant1Id} and {Participant2Id}. Returning existing conversation {ConversationId}",
                command.Participant1Id, command.Participant2Id, existingConversation.Id);
            return Result<Guid>.Success(existingConversation.Id);
        }

        var conversation = new Conversation(
            command.Participant1Id,
            command.Participant2Id,
            ConversationType.ProfessionalPatient);

        messagingDbContext.Conversations.Add(conversation);
        await messagingDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Created conversation {ConversationId} between {Participant1Id} and {Participant2Id}",
            conversation.Id, command.Participant1Id, command.Participant2Id);

        return Result<Guid>.Success(conversation.Id);
    }
}

