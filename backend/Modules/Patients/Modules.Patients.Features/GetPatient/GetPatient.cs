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
                Guid patientId,
                IQueryHandler<GetPatientQuery, GetPatientDto> handler,
                CancellationToken cancellationToken) =>
            {
                GetPatientQuery query = new GetPatientQuery(patientId);
                Result<GetPatientDto> result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    profileDto => Results.Ok(profileDto),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Patients)
            .RequireAuthorization();
    }
}
