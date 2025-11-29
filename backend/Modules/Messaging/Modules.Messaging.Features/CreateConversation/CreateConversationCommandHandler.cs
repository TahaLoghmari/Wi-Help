using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Messaging.Domain.Entities;
using Modules.Messaging.Domain.Enums;
using Modules.Messaging.Infrastructure.Database;

namespace Modules.Messaging.Features.CreateConversation;

public class CreateConversationCommandHandler(
    MessagingDbContext messagingDbContext,
    IIdentityModuleApi identityApi,
    ILogger<CreateConversationCommandHandler> logger) : ICommandHandler<CreateConversationCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateConversationCommand command, CancellationToken cancellationToken)
    {
        // Validate participants exist
        var participant1Result = await identityApi.GetUserByIdAsync(command.Participant1Id, cancellationToken);
        if (participant1Result.IsFailure)
        {
            logger.LogWarning("Participant 1 {Participant1Id} not found", command.Participant1Id);
            return Result<Guid>.Failure(Error.NotFound("Messaging.ParticipantNotFound", $"Participant with ID '{command.Participant1Id}' not found."));
        }

        var participant2Result = await identityApi.GetUserByIdAsync(command.Participant2Id, cancellationToken);
        if (participant2Result.IsFailure)
        {
            logger.LogWarning("Participant 2 {Participant2Id} not found", command.Participant2Id);
            return Result<Guid>.Failure(Error.NotFound("Messaging.ParticipantNotFound", $"Participant with ID '{command.Participant2Id}' not found."));
        }

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

