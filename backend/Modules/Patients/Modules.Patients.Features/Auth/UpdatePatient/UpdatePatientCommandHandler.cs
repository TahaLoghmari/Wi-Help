using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Domain.Ports;
using System.Transactions;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public sealed class UpdatePatientCommandHandler(
    IIdentityModuleApi identityApi,
    IUpdatePatientPort patientPort,
    IFileStorage fileStorage,
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
            string? profilePictureUrl = null;
            if (command.ProfilePicture is not null)
            {
                profilePictureUrl = await fileStorage.UploadFileAsync(
                    command.ProfilePicture,
                    "profilePicture",
                    "profile-pictures",
                    cancellationToken);
            }

            var updateUserRequest = new UpdateUserRequest(
                command.UserId,
                command.FirstName,
                command.LastName,
                command.PhoneNumber,
                command.Address,
                profilePictureUrl);

            var updateResult = await identityApi.UpdateUserAsync(updateUserRequest, cancellationToken);
            if (!updateResult.IsSuccess)
            {
                logger.LogWarning("Failed to update identity fields for UserId: {UserId}", command.UserId);
                return Result.Failure(updateResult.Error);
            }

            logger.LogInformation("Identity fields updated successfully for UserId: {UserId}", command.UserId);
            
            var patient = await patientPort.GetPatientByUserIdAsync(command.UserId, cancellationToken);

            if (patient is null)
            {
                logger.LogWarning("Patient not found for UserId: {UserId}", command.UserId);
                return Result.Failure(PatientErrors.NotFound(command.UserId));
            }

            // Validate relationship if emergency contact provided
            if (command.EmergencyContact?.RelationshipId.HasValue == true)
            {
                var relationshipId = command.EmergencyContact.RelationshipId.Value;
                if (!await patientPort.RelationshipExistsAsync(relationshipId, cancellationToken))
                {
                    logger.LogWarning("Relationship not found: {RelationshipId}", relationshipId);
                    return Result.Failure(PatientErrors.RelationshipNotFound(relationshipId));
                }
            }

            patient.Update(command.EmergencyContact, command.MobilityStatus, command.Bio);

            // Update M2M collections
            if (command.AllergyIds is not null)
            {
                var allergies = await patientPort.GetAllergiesAsync(command.AllergyIds, cancellationToken);

                if (allergies.Count != command.AllergyIds.Count)
                {
                    logger.LogWarning("Some allergy IDs were not found");
                    return Result.Failure(PatientErrors.AllergyNotFound(Guid.Empty));
                }

                patient.UpdateAllergies(allergies);
            }

            if (command.ConditionIds is not null)
            {
                var conditions = await patientPort.GetConditionsAsync(command.ConditionIds, cancellationToken);

                if (conditions.Count != command.ConditionIds.Count)
                {
                    logger.LogWarning("Some condition IDs were not found");
                    return Result.Failure(PatientErrors.ConditionNotFound(Guid.Empty));
                }

                patient.UpdateConditions(conditions);
            }

            if (command.MedicationIds is not null)
            {
                var medications = await patientPort.GetMedicationsAsync(command.MedicationIds, cancellationToken);

                if (medications.Count != command.MedicationIds.Count)
                {
                    logger.LogWarning("Some medication IDs were not found");
                    return Result.Failure(PatientErrors.MedicationNotFound(Guid.Empty));
                }

                patient.UpdateMedications(medications);
            }

            await patientPort.SaveChangesAsync(cancellationToken);

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
