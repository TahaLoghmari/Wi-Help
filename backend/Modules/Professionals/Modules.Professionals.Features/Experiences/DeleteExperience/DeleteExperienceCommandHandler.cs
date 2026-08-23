using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Experiences.DeleteExperience;

public class DeleteExperienceCommandHandler(
    IWorkExperienceOperations workExperienceOperations,
    ILogger<DeleteExperienceCommandHandler> logger) : ICommandHandler<DeleteExperienceCommand>
{
    public async Task<Result> Handle(DeleteExperienceCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting experience {ExperienceId} for professional {ProfessionalId}", 
            command.ExperienceId, command.ProfessionalId);

        var experience = await workExperienceOperations.FindAsync(command.ExperienceId, command.ProfessionalId, cancellationToken);

        if (experience is null)
        {
            logger.LogWarning("Experience not found for ID {ExperienceId}", command.ExperienceId);
            return Result.Failure(ProfessionalErrors.ExperienceNotFound(command.ExperienceId));
        }

        workExperienceOperations.Remove(experience);
        await workExperienceOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Experience {ExperienceId} deleted successfully", command.ExperienceId);

        return Result.Success();
    }
}
