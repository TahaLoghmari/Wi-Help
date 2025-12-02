using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Awards.GetAwards;

public class GetAwardsQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetAwardsQueryHandler> logger) : IQueryHandler<GetAwardsQuery, List<AwardDto>>
{
    public async Task<Result<List<AwardDto>>> Handle(GetAwardsQuery query, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting awards for professional {ProfessionalId}", query.ProfessionalId);

        var awards = await dbContext.Awards
            .AsNoTracking()
            .Where(a => a.ProfessionalId == query.ProfessionalId)
            .OrderByDescending(a => a.YearReceived)
            .Select(a => new AwardDto(
                a.Id,
                a.Title,
                a.Issuer,
                a.Description,
                a.YearReceived,
                a.CreatedAt,
                a.UpdatedAt))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} awards for professional {ProfessionalId}", 
            awards.Count, query.ProfessionalId);

        return Result<List<AwardDto>>.Success(awards);
    }
}
