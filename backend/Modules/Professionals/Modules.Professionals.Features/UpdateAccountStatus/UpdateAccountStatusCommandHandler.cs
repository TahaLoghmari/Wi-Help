using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.UpdateAccountStatus;

internal sealed class UpdateAccountStatusCommandHandler(
    ProfessionalsDbContext dbContext,
    ILogger<UpdateAccountStatusCommandHandler> logger)
    : ICommandHandler<UpdateAccountStatusCommand>
{
    public async Task<Result> Handle(UpdateAccountStatusCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating account status for professional {ProfessionalId} to {Status}", request.ProfessionalId, request.Status);

        var professional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.Id == request.ProfessionalId, cancellationToken);

        if (professional is null)
        {
            return Result.Failure(ProfessionalErrors.NotFound(request.ProfessionalId));
        }

        professional.UpdateVerificationStatus(request.Status);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Account status updated successfully for professional {ProfessionalId}", request.ProfessionalId);
        return Result.Success();
    }

}
