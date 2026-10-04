using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.Educations.CreateEducation;

public class CreateEducationCommandHandler(
    IProfessionalRepository profileRepository,
    IProfessionalQualificationsRepository repository,
    ILogger<CreateEducationCommandHandler> logger) : ICommandHandler<CreateEducationCommand, EducationDto>
{
    public async Task<Result<EducationDto>> Handle(CreateEducationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating education for professional {ProfessionalId}", command.ProfessionalId);

        var professional = await profileRepository.FindByIdReadOnlyAsync(command.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for ID {ProfessionalId}", command.ProfessionalId);
            return Result<EducationDto>.Failure(ProfessionalErrors.NotFound(command.ProfessionalId));
        }

        var education = new Education(
            command.ProfessionalId,
            command.Institution,
            command.Degree,
            command.FieldOfStudy,
            command.CountryId,
            command.Description,
            command.StartYear,
            command.EndYear,
            command.IsCurrentlyStudying);

        repository.Add(education);
        await repository.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Education created with ID {EducationId} for professional {ProfessionalId}", 
            education.Id, command.ProfessionalId);

        var dto = new EducationDto(
            education.Id,
            education.Institution,
            education.Degree,
            education.FieldOfStudy,
            education.CountryId,
            education.Description,
            education.StartYear,
            education.EndYear,
            education.IsCurrentlyStudying,
            education.CreatedAt,
            education.UpdatedAt);

        return Result<EducationDto>.Success(dto);
    }
}
