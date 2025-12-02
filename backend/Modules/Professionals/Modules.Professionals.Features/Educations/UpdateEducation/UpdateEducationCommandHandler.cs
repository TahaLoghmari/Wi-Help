using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Educations.UpdateEducation;

public class UpdateEducationCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<UpdateEducationCommandHandler> logger) : ICommandHandler<UpdateEducationCommand, EducationDto>
{
    public async Task<Result<EducationDto>> Handle(UpdateEducationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating education {EducationId} for professional {ProfessionalId}", 
            command.EducationId, command.ProfessionalId);

        var education = await dbContext.Educations
            .FirstOrDefaultAsync(e => e.Id == command.EducationId && e.ProfessionalId == command.ProfessionalId, 
                cancellationToken);

        if (education is null)
        {
            logger.LogWarning("Education not found for ID {EducationId}", command.EducationId);
            return Result<EducationDto>.Failure(ProfessionalErrors.EducationNotFound(command.EducationId));
        }

        education.Update(
            command.Institution,
            command.Degree,
            command.FieldOfStudy,
            command.Country,
            command.StartYear,
            command.EndYear,
            command.IsCurrentlyStudying);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Education {EducationId} updated successfully", command.EducationId);

        var dto = new EducationDto(
            education.Id,
            education.Institution,
            education.Degree,
            education.FieldOfStudy,
            education.Country,
            education.StartYear,
            education.EndYear,
            education.IsCurrentlyStudying,
            education.CreatedAt,
            education.UpdatedAt);

        return Result<EducationDto>.Success(dto);
    }
}
