using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Experiences.CreateExperience;

public class CreateExperienceCommandHandler(
    IProfessionalProfileOperations profileOperations,
    IProfessionalQualificationsOperations qualificationsOperations,
    ILogger<CreateExperienceCommandHandler> logger) : ICommandHandler<CreateExperienceCommand, ExperienceDto>
{
    public async Task<Result<ExperienceDto>> Handle(CreateExperienceCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating experience for professional {ProfessionalId}", command.ProfessionalId);

        var professional = await profileOperations.FindByIdReadOnlyAsync(command.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for ID {ProfessionalId}", command.ProfessionalId);
            return Result<ExperienceDto>.Failure(ProfessionalErrors.NotFound(command.ProfessionalId));
        }

        var experience = new WorkExperience(
            command.ProfessionalId,
            command.Title,
            command.Organization,
            command.Location,
            command.Description,
            command.StartYear,
            command.EndYear,
            command.IsCurrentPosition);

        qualificationsOperations.Add(experience);
        await qualificationsOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Experience created with ID {ExperienceId} for professional {ProfessionalId}", 
            experience.Id, command.ProfessionalId);

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
