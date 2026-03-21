using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.GetConditions;

internal sealed class GetConditions : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetConditions, async (
                IQueryHandler<GetConditionsQuery, List<ConditionDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetConditionsQuery();
                Result<List<ConditionDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Patients);
    }
}
