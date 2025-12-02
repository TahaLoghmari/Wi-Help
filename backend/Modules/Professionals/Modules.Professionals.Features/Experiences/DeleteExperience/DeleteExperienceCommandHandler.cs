using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Experiences.DeleteExperience;

public class DeleteExperienceCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<DeleteExperienceCommandHandler> logger) : ICommandHandler<DeleteExperienceCommand>
{
    public async Task<Result> Handle(DeleteExperienceCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting experience {ExperienceId} for professional {ProfessionalId}", 
            command.ExperienceId, command.ProfessionalId);

        var experience = await dbContext.WorkExperiences
            .FirstOrDefaultAsync(e => e.Id == command.ExperienceId && e.ProfessionalId == command.ProfessionalId, 
                cancellationToken);

        if (experience is null)
        {
            logger.LogWarning("Experience not found for ID {ExperienceId}", command.ExperienceId);
            return Result.Failure(ProfessionalErrors.ExperienceNotFound(command.ExperienceId));
        }

        dbContext.WorkExperiences.Remove(experience);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Experience {ExperienceId} deleted successfully", command.ExperienceId);

        return Result.Success();
    }
}
