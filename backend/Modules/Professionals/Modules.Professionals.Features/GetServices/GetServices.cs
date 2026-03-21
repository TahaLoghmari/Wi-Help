using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.GetServices;

internal sealed class GetServices : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        // GET /specializations/{specializationId}/services — returns services filtered by specialization
        app.MapGet(ProfessionalsEndpoints.GetServicesBySpecialization, async (
                Guid specializationId,
                IQueryHandler<GetServicesQuery, List<ServiceDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetServicesQuery(specializationId);
                Result<List<ServiceDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals);
    }
}
