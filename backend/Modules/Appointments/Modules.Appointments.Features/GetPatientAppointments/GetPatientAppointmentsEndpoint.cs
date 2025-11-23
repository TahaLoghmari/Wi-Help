using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Appointments.Features.DTOs;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.GetPatientAppointments;

internal sealed class GetPatientAppointmentsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("appointments/patient/{patientId:guid}", async (
                Guid patientId,
                int? page,
                int? pageSize,
                IQueryHandler<GetPatientAppointmentsQuery, PagedResponse<AppointmentDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetPatientAppointmentsQuery(patientId, page ?? 1, pageSize ?? 10);
                Result<PagedResponse<AppointmentDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments);
    }
}
