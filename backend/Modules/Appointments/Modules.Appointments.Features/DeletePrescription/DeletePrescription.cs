using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.DeletePrescription;

internal sealed class DeletePrescription : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(AppointmentsEndpoints.DeletePrescription, async (
                Guid prescriptionId,
                ICommandHandler<DeletePrescriptionCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new DeletePrescriptionCommand(prescriptionId);
                var result = await handler.Handle(command, cancellationToken);

                return result.Match(() => Results.NoContent(), CustomResults.Problem);
            })
            .WithTags(Tags.Appointments)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}
