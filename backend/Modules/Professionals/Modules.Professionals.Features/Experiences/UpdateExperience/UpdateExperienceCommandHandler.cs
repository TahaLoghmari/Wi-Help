using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Experiences.UpdateExperience;

public class UpdateExperienceCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<UpdateExperienceCommandHandler> logger) : ICommandHandler<UpdateExperienceCommand, ExperienceDto>
{
    public async Task<Result<ExperienceDto>> Handle(UpdateExperienceCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating experience {ExperienceId} for professional {ProfessionalId}", 
            command.ExperienceId, command.ProfessionalId);

        var experience = await dbContext.WorkExperiences
            .FirstOrDefaultAsync(e => e.Id == command.ExperienceId && e.ProfessionalId == command.ProfessionalId, 
                cancellationToken);

        if (experience is null)
        {
            logger.LogWarning("Experience not found for ID {ExperienceId}", command.ExperienceId);
            return Result<ExperienceDto>.Failure(ProfessionalErrors.ExperienceNotFound(command.ExperienceId));
        }

        experience.Update(
            command.Title,
            command.Organization,
            command.Location,
            command.Description,
            command.StartYear,
            command.EndYear,
            command.IsCurrentPosition);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Experience {ExperienceId} updated successfully", command.ExperienceId);

        var dto = new ExperienceDto(
            experience.Id,
            experience.Title,
            experience.Organization,
            experience.Location,
            experience.Description,
            experience.StartYear,
            experience.EndYear,
            experience.IsCurrentPosition,
            experience.CreatedAt,
            experience.UpdatedAt);

        return Result<ExperienceDto>.Success(dto);
    }
}
