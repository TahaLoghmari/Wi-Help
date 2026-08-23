using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Awards.CreateAward;

public class CreateAwardCommandHandler(
    IProfessionalProfileOperations profileOperations,
    IAwardOperations awardOperations,
    ILogger<CreateAwardCommandHandler> logger) : ICommandHandler<CreateAwardCommand, AwardDto>
{
    public async Task<Result<AwardDto>> Handle(CreateAwardCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating award for professional {ProfessionalId}", command.ProfessionalId);

        var professional = await profileOperations.FindByIdReadOnlyAsync(command.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            logger.LogWarning("Professional not found for ID {ProfessionalId}", command.ProfessionalId);
            return Result<AwardDto>.Failure(ProfessionalErrors.NotFound(command.ProfessionalId));
        }

        var award = new Award(
            command.ProfessionalId,
            command.Title,
            command.Issuer,
            command.Description,
            command.YearReceived);

        awardOperations.Add(award);
        await awardOperations.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Award created with ID {AwardId} for professional {ProfessionalId}", 
            award.Id, command.ProfessionalId);

        var dto = new AwardDto(
            award.Id,
            award.Title,
            award.Issuer,
            award.Description,
            award.YearReceived,
            award.CreatedAt,
            award.UpdatedAt);

        return Result<AwardDto>.Success(dto);
    }
}
