using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Appointments.Features.DTOs;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.GetAppointments;

internal sealed class GetAppointments : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(AppointmentsEndpoints.GetAppointments, async (
                int? page,
                int? pageSize,
                IQueryHandler<GetAppointmentsQuery, PagedResponse<AppointmentDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetAppointmentsQuery(page ?? 1, pageSize ?? 10);
                Result<PagedResponse<AppointmentDto>> result = await handler.Handle(query, cancellationToken);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments);
    }
}
