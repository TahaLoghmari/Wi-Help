using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Educations.DeleteEducation;

public class DeleteEducationCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<DeleteEducationCommandHandler> logger) : ICommandHandler<DeleteEducationCommand>
{
    public async Task<Result> Handle(DeleteEducationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting education {EducationId} for professional {ProfessionalId}", 
            command.EducationId, command.ProfessionalId);

        var education = await dbContext.Educations
            .FirstOrDefaultAsync(e => e.Id == command.EducationId && e.ProfessionalId == command.ProfessionalId, 
                cancellationToken);

        if (education is null)
        {
            logger.LogWarning("Education not found for ID {EducationId}", command.EducationId);
            return Result.Failure(ProfessionalErrors.EducationNotFound(command.EducationId));
        }

        dbContext.Educations.Remove(education);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Education {EducationId} deleted successfully", command.EducationId);

        return Result.Success();
    }
}
