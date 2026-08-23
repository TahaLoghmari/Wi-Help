using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Educations.DeleteEducation;

public class DeleteEducationCommandHandler(
    IProfessionalQualificationsOperations qualificationsOperations,
    ILogger<DeleteEducationCommandHandler> logger) : ICommandHandler<DeleteEducationCommand>
{
    public async Task<Result> Handle(DeleteEducationCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting education {EducationId} for professional {ProfessionalId}", 
            command.EducationId, command.ProfessionalId);

        var education = await qualificationsOperations.FindEducationAsync(command.EducationId, command.ProfessionalId, cancellationToken);

        if (education is null)
        {
            logger.LogWarning("Education not found for ID {EducationId}", command.EducationId);
            return Result.Failure(ProfessionalErrors.EducationNotFound(command.EducationId));
        }

        qualificationsOperations.Remove(education);
        await qualificationsOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Education {EducationId} deleted successfully", command.EducationId);

        return Result.Success();
    }
}
