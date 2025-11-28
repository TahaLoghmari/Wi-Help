using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.GetPatient;

internal sealed class GetPatient : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetPatient, async (
                [AsParameters] Request request,
                IQueryHandler<GetPatientQuery, GetPatientDto> handler,
                CancellationToken cancellationToken) =>
            {
                GetPatientQuery query = new GetPatientQuery(request.PatientId);
                Result<GetPatientDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    profileDto => Results.Ok(profileDto),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Patients)
            .RequireAuthorization();
    }

    private record Request
    {
        public Guid PatientId { get; init; }
    }
}
