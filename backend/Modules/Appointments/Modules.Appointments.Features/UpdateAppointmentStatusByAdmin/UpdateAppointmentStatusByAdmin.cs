using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Appointments.Domain.Enums;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.UpdateAppointmentStatusByAdmin;

internal sealed class UpdateAppointmentStatusByAdmin : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(AppointmentsEndpoints.UpdateAppointmentStatusByAdmin, async (
                Guid appointmentId,
                Request request,
                ICommandHandler<UpdateAppointmentStatusByAdminCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new UpdateAppointmentStatusByAdminCommand(appointmentId, request.Status);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    private sealed record Request(AppointmentStatus Status);
}
