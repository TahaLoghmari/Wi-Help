using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetProfessional;

internal sealed class GetProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalById, async (
                Guid id,
                IQueryHandler<GetProfessionalQuery, ProfessionalProfileDto> handler,
                CancellationToken cancellationToken) =>
            {
                GetProfessionalQuery query = new GetProfessionalQuery(id);
                Result<ProfessionalProfileDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    profileDto => Results.Ok(profileDto),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization();
    }
}
