using Microsoft.Extensions.Logging;
using Modules.Appointments.Domain.Repositories;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.DeletePrescription;

public class DeletePrescriptionHandler(
    IAppointmentRepository appointments,
    ILogger<DeletePrescriptionHandler> logger) : ICommandHandler<DeletePrescriptionCommand>
{
    public async Task<Result> Handle(DeletePrescriptionCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting prescription {PrescriptionId}", command.PrescriptionId);

        var prescription = await appointments.GetPrescriptionByIdAsync(command.PrescriptionId, cancellationToken);

        if (prescription is null)
        {
            return Result.Failure(new Error("Prescription.NotFound", "Prescription not found", ErrorType.NotFound));
        }

        appointments.RemovePrescription(prescription);
        await appointments.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
