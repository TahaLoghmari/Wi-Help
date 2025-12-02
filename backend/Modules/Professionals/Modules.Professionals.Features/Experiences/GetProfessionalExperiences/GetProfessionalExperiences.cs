using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Features.Experiences.GetExperiences;

namespace Modules.Professionals.Features.Experiences.GetProfessionalExperiences;

internal sealed class GetProfessionalExperiences : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalExperiences, async (
                [AsParameters] Request request,
                IQueryHandler<GetExperiencesQuery, List<ExperienceDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetExperiencesQuery(request.ProfessionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    experiences => Results.Ok(experiences),
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
