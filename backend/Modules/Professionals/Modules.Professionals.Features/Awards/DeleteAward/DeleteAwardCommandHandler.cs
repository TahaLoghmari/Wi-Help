using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Awards.DeleteAward;

public class DeleteAwardCommandHandler(
    IAwardOperations awardOperations,
    ILogger<DeleteAwardCommandHandler> logger) : ICommandHandler<DeleteAwardCommand>
{
    public async Task<Result> Handle(DeleteAwardCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting award {AwardId} for professional {ProfessionalId}", 
            command.AwardId, command.ProfessionalId);

        var award = await awardOperations.FindAsync(command.AwardId, command.ProfessionalId, cancellationToken);

        if (award is null)
        {
            logger.LogWarning("Award not found for ID {AwardId}", command.AwardId);
            return Result.Failure(ProfessionalErrors.AwardNotFound(command.AwardId));
        }

        awardOperations.Remove(award);
        await awardOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Award {AwardId} deleted successfully", command.AwardId);

        return Result.Success();
    }
}
