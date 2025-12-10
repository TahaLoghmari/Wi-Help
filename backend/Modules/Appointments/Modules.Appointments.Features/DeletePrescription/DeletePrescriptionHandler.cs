using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Appointments.Features.DeletePrescription;

public class DeletePrescriptionHandler(
    AppointmentsDbContext dbContext,
    ILogger<DeletePrescriptionHandler> logger) : ICommandHandler<DeletePrescriptionCommand>
{
    public async Task<Result> Handle(DeletePrescriptionCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting prescription {PrescriptionId}", command.PrescriptionId);

        var prescription = await dbContext.Prescriptions
            .FirstOrDefaultAsync(p => p.Id == command.PrescriptionId, cancellationToken);

        if (prescription is null)
        {
            return Result.Failure(new Error("Prescription.NotFound", "Prescription not found", ErrorType.NotFound));
        }

        dbContext.Prescriptions.Remove(prescription);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
