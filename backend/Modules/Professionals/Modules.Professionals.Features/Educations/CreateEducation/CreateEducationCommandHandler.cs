using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Educations.CreateEducation;

public class CreateEducationCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<CreateEducationCommandHandler> logger) : ICommandHandler<CreateEducationCommand, EducationDto>
{
    public async Task<Result<EducationDto>> Handle(CreateEducationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating education for professional {ProfessionalId}", command.ProfessionalId);

        var professional = await dbContext.Professionals
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == command.ProfessionalId, cancellationToken);

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
            command.Country,
            command.StartYear,
            command.EndYear,
            command.IsCurrentlyStudying);

        dbContext.Educations.Add(education);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Education created with ID {EducationId} for professional {ProfessionalId}", 
            education.Id, command.ProfessionalId);

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
