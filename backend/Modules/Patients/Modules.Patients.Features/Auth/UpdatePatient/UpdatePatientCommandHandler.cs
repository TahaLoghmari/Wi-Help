using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;
using System.Transactions;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public sealed class UpdatePatientCommandHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<UpdatePatientCommandHandler> logger) : ICommandHandler<UpdatePatientCommand>
{
    public async Task<Result> Handle(
        UpdatePatientCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Patient update attempt started for UserId: {UserId}", command.UserId);

        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
            Timeout = TransactionManager.DefaultTimeout
        };

        using var transactionScope = new TransactionScope(
            TransactionScopeOption.Required,
            transactionOptions,
            TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            var updateUserRequest = new UpdateUserRequest(
                command.UserId,
                command.FirstName,
                command.LastName,
                command.PhoneNumber,
                command.Address);

            var updateResult = await identityApi.UpdateUserAsync(updateUserRequest, cancellationToken);
            if (!updateResult.IsSuccess)
            {
                logger.LogWarning("Failed to update identity fields for UserId: {UserId}", command.UserId);
                return Result.Failure(updateResult.Error);
            }

            logger.LogInformation("Identity fields updated successfully for UserId: {UserId}", command.UserId);
            
            var patient = await dbContext.Patients
                .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

            if (patient is null)
            {
                logger.LogWarning("Patient not found for UserId: {UserId}", command.UserId);
                return Result.Failure(PatientErrors.NotFound(command.UserId));
            }

            patient.Update(command.EmergencyContact);

            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Patient updated successfully for UserId: {UserId}, PatientId: {PatientId}",
                command.UserId, patient.Id);

            transactionScope.Complete();
            logger.LogInformation("Transaction completed successfully for UserId: {UserId}", command.UserId);

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during patient update for UserId: {UserId}, transaction will be rolled back", command.UserId);
            throw;
        }
    }
}
