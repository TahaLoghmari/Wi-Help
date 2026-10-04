using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.Awards.CreateAward;

public class CreateAwardCommandHandler(
    IProfessionalRepository profileRepository,
    IProfessionalQualificationsRepository repository,
    ILogger<CreateAwardCommandHandler> logger) : ICommandHandler<CreateAwardCommand, AwardDto>
{
    public async Task<Result<AwardDto>> Handle(CreateAwardCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating award for professional {ProfessionalId}", command.ProfessionalId);

        var professional = await profileRepository.FindByIdReadOnlyAsync(command.ProfessionalId, cancellationToken);

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

        repository.Add(award);
        await repository.SaveChangesAsync(cancellationToken);

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
