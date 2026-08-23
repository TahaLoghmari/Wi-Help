using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Awards.GetAwards;

public class GetAwardsQueryHandler(
    IProfessionalQualificationsOperations qualificationsOperations,
    ILogger<GetAwardsQueryHandler> logger) : IQueryHandler<GetAwardsQuery, List<AwardDto>>
{
    public async Task<Result<List<AwardDto>>> Handle(GetAwardsQuery query, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting awards for professional {ProfessionalId}", query.ProfessionalId);

        var awards = (await qualificationsOperations.GetAwardsAsync(query.ProfessionalId, cancellationToken))
            .Select(a => new AwardDto(
                a.Id,
                a.Title,
                a.Issuer,
                a.Description,
                a.YearReceived,
                a.CreatedAt,
                a.UpdatedAt))
            .ToList();

        logger.LogInformation("Found {Count} awards for professional {ProfessionalId}", 
            awards.Count, query.ProfessionalId);

        return Result<List<AwardDto>>.Success(awards);
    }
}
