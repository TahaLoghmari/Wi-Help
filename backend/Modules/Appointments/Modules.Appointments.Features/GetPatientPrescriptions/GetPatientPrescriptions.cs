using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;

namespace Modules.Appointments.Features.GetPatientPrescriptions;

public class GetPatientPrescriptions : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetPatientPrescriptions, async (
                int? page,
                int? pageSize,
                HttpContext httpContext,
                IQueryHandler<GetPatientPrescriptionsQuery, PagedResult<PrescriptionDto>> handler,
                IPatientsModuleApi patientsApi,
                CancellationToken cancellationToken) =>
            {
                var userIdString = httpContext.User.FindFirst("sub")?.Value;
                if (!Guid.TryParse(userIdString, out Guid userId))
                {
                    return Results.Unauthorized();
                }

                // Get patientId from userId
                var patientResult = await patientsApi.GetPatientByUserIdAsync(userId, cancellationToken);
                if (patientResult.IsFailure)
                {
                    return CustomResults.Problem(patientResult.Error);
                }

                var query = new GetPatientPrescriptionsQuery(
                    patientResult.Value.Id,
                    page ?? 1,
                    pageSize ?? 10);

                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    prescriptions => Results.Ok(prescriptions),
                    CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Patient" });
    }
}
