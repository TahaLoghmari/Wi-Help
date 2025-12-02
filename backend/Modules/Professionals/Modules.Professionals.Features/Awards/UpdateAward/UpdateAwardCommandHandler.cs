using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Awards.UpdateAward;

public class UpdateAwardCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<UpdateAwardCommandHandler> logger) : ICommandHandler<UpdateAwardCommand, AwardDto>
{
    public async Task<Result<AwardDto>> Handle(UpdateAwardCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating award {AwardId} for professional {ProfessionalId}", 
            command.AwardId, command.ProfessionalId);

        var award = await dbContext.Awards
            .FirstOrDefaultAsync(a => a.Id == command.AwardId && a.ProfessionalId == command.ProfessionalId, 
                cancellationToken);

        if (award is null)
        {
            logger.LogWarning("Award not found for ID {AwardId}", command.AwardId);
            return Result<AwardDto>.Failure(ProfessionalErrors.AwardNotFound(command.AwardId));
        }

        award.Update(
            command.Title,
            command.Issuer,
            command.Description,
            command.YearReceived);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Award {AwardId} updated successfully", command.AwardId);

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
