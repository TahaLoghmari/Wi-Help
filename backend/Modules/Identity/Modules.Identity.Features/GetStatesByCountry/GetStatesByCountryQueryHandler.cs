using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Ports;

namespace Modules.Identity.Features.GetStatesByCountry;

public sealed class GetStatesByCountryQueryHandler(
    IIdentityLocationLookup locationLookup,
    ILogger<GetStatesByCountryQueryHandler> logger) : IQueryHandler<GetStatesByCountryQuery, List<StateDto>>
{
    public async Task<Result<List<StateDto>>> Handle(
        GetStatesByCountryQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving states for CountryId: {CountryId}", query.CountryId);

        var states = (await locationLookup.GetStatesByCountryAsync(query.CountryId, cancellationToken))
            .Select(state => new StateDto(state.Id, state.Key, state.CountryId))
            .ToList();

        logger.LogInformation("Retrieved {Count} states for CountryId: {CountryId}", states.Count, query.CountryId);

        return Result<List<StateDto>>.Success(states);
    }
}
