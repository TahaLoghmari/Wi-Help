using Microsoft.EntityFrameworkCore;
using Modules.Identity.Domain.Ports;
using Modules.Identity.Infrastructure.Database;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityLocationLookup(IdentityDbContext dbContext) : IIdentityLocationLookup
{
    public async Task<IReadOnlyList<CountryLookup>> GetCountriesAsync(CancellationToken cancellationToken) =>
        await dbContext.Countries.AsNoTracking().OrderBy(country => country.Key)
            .Select(country => new CountryLookup(country.Id, country.Key)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<StateLookup>> GetStatesByCountryAsync(Guid countryId, CancellationToken cancellationToken) =>
        await dbContext.States.AsNoTracking().Where(state => state.CountryId == countryId).OrderBy(state => state.Key)
            .Select(state => new StateLookup(state.Id, state.Key, state.CountryId)).ToListAsync(cancellationToken);
}
