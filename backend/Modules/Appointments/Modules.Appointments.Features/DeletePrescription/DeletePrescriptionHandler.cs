using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.DeletePrescription;

public class DeletePrescriptionHandler(
    IDeletePrescriptionStore prescriptionsStore,
    ILogger<DeletePrescriptionHandler> logger) : ICommandHandler<DeletePrescriptionCommand>
{
    public async Task<Result> Handle(DeletePrescriptionCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting prescription {PrescriptionId}", command.PrescriptionId);

        var prescription = await prescriptionsStore.GetAsync(command.PrescriptionId, cancellationToken);

        if (prescription is null)
        {
            return Result.Failure(new Error("Prescription.NotFound", "Prescription not found", ErrorType.NotFound));
        }

        await prescriptionsStore.DeleteAsync(prescription, cancellationToken);

        return Result.Success();
    }
}
