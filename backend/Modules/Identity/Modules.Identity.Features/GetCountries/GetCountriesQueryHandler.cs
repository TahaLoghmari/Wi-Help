using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Infrastructure.Database;

namespace Modules.Identity.Features.GetCountries;

public sealed class GetCountriesQueryHandler(
    IdentityDbContext dbContext,
    ILogger<GetCountriesQueryHandler> logger) : IQueryHandler<GetCountriesQuery, List<CountryDto>>
{
    public async Task<Result<List<CountryDto>>> Handle(
        GetCountriesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all countries");

        var countries = await dbContext.Countries
            .AsNoTracking()
            .OrderBy(c => c.Key)
            .Select(c => new CountryDto(c.Id, c.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} countries", countries.Count);

        return Result<List<CountryDto>>.Success(countries);
    }
}
