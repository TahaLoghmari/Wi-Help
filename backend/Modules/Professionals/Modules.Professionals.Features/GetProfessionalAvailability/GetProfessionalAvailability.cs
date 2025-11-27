using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Professionals.Features.GetProfessionalAvailability;

public class GetProfessionalAvailability : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalAvailability,
                async (
                    [AsParameters] Request request,
                    IQueryHandler<GetProfessionalAvailabilityQuery, MonthlyAvailabilityResponse> handler,
                    CancellationToken cancellationToken) =>
                {
                    var query = new GetProfessionalAvailabilityQuery(
                        request.ProfessionalId,
                        request.Year,
                        request.Month);

                    var result = await handler.Handle(query, cancellationToken);

                    return result.Match(Results.Ok, CustomResults.Problem);
                })
            .RequireAuthorization()
            .WithName("GetProfessionalAvailability")
            .WithTags("Professionals");
    }

    private record Request
    {
        public Guid ProfessionalId { get; init; }
        public int Year { get; init; }
        public int Month { get; init; }
    }
}


