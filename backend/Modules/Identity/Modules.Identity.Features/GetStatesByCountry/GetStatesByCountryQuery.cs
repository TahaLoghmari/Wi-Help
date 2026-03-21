using Modules.Common.Features.Abstractions;

namespace Modules.Identity.Features.GetStatesByCountry;

public sealed record GetStatesByCountryQuery(Guid CountryId) : IQuery<List<StateDto>>;
