using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Features.Educations.GetEducations;

namespace Modules.Professionals.Features.Educations.GetProfessionalEducations;

internal sealed class GetProfessionalEducations : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalEducations, async (
                [AsParameters] Request request,
                IQueryHandler<GetEducationsQuery, List<EducationDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetEducationsQuery(request.ProfessionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    educations => Results.Ok(educations),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization();
    }

    private class Request
    {
        public Guid ProfessionalId { get; set; }
    }
}
