using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.DeletePrescription;

public class DeletePrescriptionHandler(
    IAppointmentWorkflow appointmentsWorkflow,
    ILogger<DeletePrescriptionHandler> logger) : ICommandHandler<DeletePrescriptionCommand>
{
    public async Task<Result> Handle(DeletePrescriptionCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting prescription {PrescriptionId}", command.PrescriptionId);

        var wasDeleted = await appointmentsWorkflow.DeletePrescriptionAsync(command.PrescriptionId, cancellationToken);

        if (!wasDeleted)
        {
            return Result.Failure(new Error("Prescription.NotFound", "Prescription not found", ErrorType.NotFound));
        }

        return Result.Success();
    }
}
