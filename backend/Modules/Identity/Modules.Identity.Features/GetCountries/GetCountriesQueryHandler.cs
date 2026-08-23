using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Features.GetCountries;

public sealed class GetCountriesQueryHandler(
    IIdentityLocationLookup locationLookup,
    ILogger<GetCountriesQueryHandler> logger) : IQueryHandler<GetCountriesQuery, List<CountryDto>>
{
    public async Task<Result<List<CountryDto>>> Handle(
        GetCountriesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all countries");

        var countries = (await locationLookup.GetCountriesAsync(cancellationToken))
            .Select(country => new CountryDto(country.Id, country.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} countries", countries.Count);

        return Result<List<CountryDto>>.Success(countries);
    }
}
