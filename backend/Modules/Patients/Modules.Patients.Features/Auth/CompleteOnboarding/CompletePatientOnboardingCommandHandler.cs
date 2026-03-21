using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Patients.Domain;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.Auth.CompleteOnboarding;

public sealed class CompletePatientOnboardingCommandHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<CompletePatientOnboardingCommandHandler> logger) : ICommandHandler<CompletePatientOnboardingCommand>
{
    public async Task<Result> Handle(
        CompletePatientOnboardingCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Completing onboarding for patient with UserId: {UserId}", command.UserId);

        // Validate relationship exists if provided
        if (command.EmergencyContact.RelationshipId.HasValue)
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

        // Complete onboarding in Identity module
        var completeOnboardingRequest = new CompleteOnboardingRequest(
            command.UserId,
            command.DateOfBirth,
            command.Gender,
            command.PhoneNumber,
            command.Address);

        var onboardingResult = await identityApi.CompleteOnboardingAsync(
            completeOnboardingRequest,
            cancellationToken);

        if (!onboardingResult.IsSuccess)
        {
            logger.LogWarning("Failed to complete user onboarding for UserId: {UserId}", command.UserId);
            return Result.Failure(onboardingResult.Error);
        }

        // Check if patient already exists
        var existingPatient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

        if (existingPatient is not null)
        {
            // Update existing patient's emergency contact
            existingPatient.Update(emergencyContact: command.EmergencyContact);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            logger.LogInformation("Updated existing patient for UserId: {UserId}", command.UserId);
            return Result.Success();
        }

        // Create new patient
        var patient = new Patient(command.UserId, command.EmergencyContact);

        dbContext.Patients.Add(patient);
        await dbContext.SaveChangesAsync(cancellationToken);

        var addClaimResult = await identityApi.AddClaimAsync(
            command.UserId, 
            "PatientId", 
            patient.Id.ToString(), 
            cancellationToken);
        
        if (!addClaimResult.IsSuccess)
        {
            logger.LogWarning("Failed to add PatientId claim for UserId: {UserId}", command.UserId);
        }

        logger.LogInformation("Patient onboarding completed successfully for UserId: {UserId}, PatientId: {PatientId}",
            command.UserId, patient.Id);

        return Result.Success();
    }
}
