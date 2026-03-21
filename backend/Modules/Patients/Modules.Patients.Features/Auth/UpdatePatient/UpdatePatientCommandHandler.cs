using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Patients.Domain;
using Modules.Patients.Infrastructure.Database;
using System.Transactions;
using Modules.Common.Infrastructure.Services;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Patients.Features.Auth.UpdatePatient;

public sealed class UpdatePatientCommandHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    SupabaseService supabaseService,
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
                profilePictureUrl = await supabaseService.UploadFileAsync(
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
            
            var patient = await dbContext.Patients
                .Include(p => p.Allergies)
                .Include(p => p.Conditions)
                .Include(p => p.Medications)
                .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

            if (patient is null)
            {
                logger.LogWarning("Patient not found for UserId: {UserId}", command.UserId);
                return Result.Failure(PatientErrors.NotFound(command.UserId));
            }

            // Validate relationship if emergency contact provided
            if (command.EmergencyContact?.RelationshipId.HasValue == true)
            {
                var relationship = await dbContext.Relationships
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r => r.Id == command.EmergencyContact.RelationshipId.Value, cancellationToken);

                if (relationship is null)
                {
                    logger.LogWarning("Relationship not found: {RelationshipId}", command.EmergencyContact.RelationshipId.Value);
                    return Result.Failure(PatientErrors.RelationshipNotFound(command.EmergencyContact.RelationshipId.Value));
                }
            }

            patient.Update(command.EmergencyContact, command.MobilityStatus, command.Bio);

            // Update M2M collections
            if (command.AllergyIds is not null)
            {
                var allergies = await dbContext.Allergies
                    .Where(a => command.AllergyIds.Contains(a.Id))
                    .ToListAsync(cancellationToken);

                if (allergies.Count != command.AllergyIds.Count)
                {
                    logger.LogWarning("Some allergy IDs were not found");
                    return Result.Failure(PatientErrors.AllergyNotFound(Guid.Empty));
                }

                patient.UpdateAllergies(allergies);
            }

            if (command.ConditionIds is not null)
            {
                var conditions = await dbContext.Conditions
                    .Where(c => command.ConditionIds.Contains(c.Id))
                    .ToListAsync(cancellationToken);

                if (conditions.Count != command.ConditionIds.Count)
                {
                    logger.LogWarning("Some condition IDs were not found");
                    return Result.Failure(PatientErrors.ConditionNotFound(Guid.Empty));
                }

                patient.UpdateConditions(conditions);
            }

            if (command.MedicationIds is not null)
            {
                var medications = await dbContext.Medications
                    .Where(m => command.MedicationIds.Contains(m.Id))
                    .ToListAsync(cancellationToken);

                if (medications.Count != command.MedicationIds.Count)
                {
                    logger.LogWarning("Some medication IDs were not found");
                    return Result.Failure(PatientErrors.MedicationNotFound(Guid.Empty));
                }

                patient.UpdateMedications(medications);
            }

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
