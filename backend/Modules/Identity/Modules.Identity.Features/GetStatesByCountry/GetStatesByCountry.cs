using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Identity.Features.GetStatesByCountry;

internal sealed class GetStatesByCountry : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(IdentityEndpoints.GetStatesByCountry, async (
                Guid countryId,
                IQueryHandler<GetStatesByCountryQuery, List<StateDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetStatesByCountryQuery(countryId);
                Result<List<StateDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Authentication);
    }
}
