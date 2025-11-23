using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessionals;

internal sealed class GetProfessionals : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetAllProfessionals, async (
                IQueryHandler<GetProfessionalsQuery, List<ProfessionalProfileDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetProfessionalsQuery();
                Result<List<ProfessionalProfileDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals);
    }
}
