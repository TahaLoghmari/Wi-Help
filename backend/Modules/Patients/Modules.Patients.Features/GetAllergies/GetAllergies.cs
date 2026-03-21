using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.GetAllergies;

internal sealed class GetAllergies : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetAllergies, async (
                IQueryHandler<GetAllergiesQuery, List<AllergyDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAllergiesQuery();
                Result<List<AllergyDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Patients);
    }
}
