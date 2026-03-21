using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.GetCountries;

internal sealed class GetCountries : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.GetCountries, async (
                IQueryHandler<GetCountriesQuery, List<CountryDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetCountriesQuery();
                Result<List<CountryDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Authentication);
    }
}
