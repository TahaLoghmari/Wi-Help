using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.GetMedications;

internal sealed class GetMedications : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetMedications, async (
                IQueryHandler<GetMedicationsQuery, List<MedicationDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetMedicationsQuery();
                Result<List<MedicationDto>> result = await handler.Handle(query, cancellationToken);
                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Patients);
    }
}
