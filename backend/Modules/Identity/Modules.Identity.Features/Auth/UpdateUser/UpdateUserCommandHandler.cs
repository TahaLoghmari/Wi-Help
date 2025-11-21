using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;
using System.Transactions;

namespace Modules.Identity.Features.Auth.UpdateUser;

public sealed class UpdateUserCommandHandler(
    UserManager<User> userManager,
    ILogger<UpdateUserCommandHandler> logger,
    IPatientsModuleApi patientApi,
    IProfessionalModuleApi professionalApi) : ICommandHandler<UpdateUserCommand>
{
    public async Task<Result> Handle(
        UpdateUserCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("User update attempt started for UserId: {UserId}", command.UserId);

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
            User? user = await userManager.FindByIdAsync(command.UserId.ToString());
            if (user is null)
            {
                logger.LogWarning("Update failed - user not found: {UserId}", command.UserId);
                return Result.Failure(UpdateUserErrors.UserNotFound());
            }

            user.Update(
                command.FirstName,
                command.LastName,
                command.PhoneNumber,
                command.Address);

            IdentityResult result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                logger.LogError("User update failed for {UserId}. Errors: {Errors}",
                    command.UserId,
                    string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
                return Result.Failure(UpdateUserErrors.UpdateFailed());
            }

            logger.LogInformation("User updated successfully for {UserId}", command.UserId);

            var userRoles = await userManager.GetRolesAsync(user);
            
            if (userRoles.Count == 0)
            {
                logger.LogInformation("User has no role assigned, skipping profile update");
                transactionScope.Complete();
                return Result.Success();
            }

            string userRole = userRoles[0];

            if (string.Equals(userRole, "Patient", StringComparison.OrdinalIgnoreCase))
            {
                if (command.EmergencyContact is not null)
                {
                    UpdatePatientRequest patientRequest = new UpdatePatientRequest(
                        user.Id,
                        command.EmergencyContact
                    );

                    Result updatePatientResult = await patientApi.UpdatePatientAsync(
                        patientRequest,
                        cancellationToken);

                    if (!updatePatientResult.IsSuccess)
                    {
                        logger.LogWarning("Patient profile update failed for {UserId}, rolling back transaction", command.UserId);
                        return Result.Failure(updatePatientResult.Error);
                    }

                    logger.LogInformation("Patient profile updated successfully for {UserId}", command.UserId);
                }
            }
            else if (string.Equals(userRole, "Professional", StringComparison.OrdinalIgnoreCase))
            {
                if (command.Specialization is not null || command.Services is not null || 
                    command.Experience is not null || command.StartPrice is not null || 
                    command.EndPrice is not null || command.Bio is not null)
                {
                    UpdateProfessionalRequest professionalRequest = new UpdateProfessionalRequest(
                        user.Id,
                        command.Specialization,
                        command.Services,
                        command.Experience,
                        command.StartPrice,
                        command.EndPrice,
                        command.Bio
                    );

                    Result updateProfessionalResult = await professionalApi.UpdateProfessionalAsync(
                        professionalRequest,
                        cancellationToken);

                    if (!updateProfessionalResult.IsSuccess)
                    {
                        logger.LogWarning("Professional profile update failed for {UserId}, rolling back transaction", command.UserId);
                        return Result.Failure(updateProfessionalResult.Error);
                    }

                    logger.LogInformation("Professional profile updated successfully for {UserId}", command.UserId);
                }
            }

            transactionScope.Complete();
            logger.LogInformation("Transaction completed successfully for UserId: {UserId}", command.UserId);

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during user update for UserId: {UserId}, transaction will be rolled back", command.UserId);
            throw;
        }
    }
}
