using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Infrastructure.Database;

namespace Modules.Identity.Features.GetStatesByCountry;

public sealed class GetStatesByCountryQueryHandler(
    IdentityDbContext dbContext,
    ILogger<GetStatesByCountryQueryHandler> logger) : IQueryHandler<GetStatesByCountryQuery, List<StateDto>>
{
    public async Task<Result<List<StateDto>>> Handle(
        GetStatesByCountryQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving states for CountryId: {CountryId}", query.CountryId);

        var states = await dbContext.States
            .AsNoTracking()
            .Where(s => s.CountryId == query.CountryId)
            .OrderBy(s => s.Key)
            .Select(s => new StateDto(s.Id, s.Key, s.CountryId))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} states for CountryId: {CountryId}", states.Count, query.CountryId);

        return Result<List<StateDto>>.Success(states);
    }
}
