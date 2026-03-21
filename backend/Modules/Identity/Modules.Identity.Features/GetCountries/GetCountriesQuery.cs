using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.GetCountries;

public sealed record GetCountriesQuery : IQuery<List<CountryDto>>;
