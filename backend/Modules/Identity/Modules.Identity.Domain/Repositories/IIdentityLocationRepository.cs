namespace Modules.Identity.Domain.Repositories;

public sealed record CountryLookup(Guid Id, string Key);
public sealed record StateLookup(Guid Id, string Key, Guid CountryId);

public interface IIdentityLocationRepository
{
    Task<IReadOnlyList<CountryLookup>> GetCountriesAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<StateLookup>> GetStatesByCountryAsync(Guid countryId, CancellationToken cancellationToken);
}
