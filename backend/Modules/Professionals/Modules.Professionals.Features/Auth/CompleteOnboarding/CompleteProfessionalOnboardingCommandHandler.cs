using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Features.Auth.CompleteOnboarding;

public sealed class CompleteProfessionalOnboardingCommandHandler(
    IIdentityModuleApi identityApi,
    IProfessionalProfileOperations profileOperations,
    IProfessionalCatalogOperations catalogOperations,
    ILogger<CompleteProfessionalOnboardingCommandHandler> logger) : ICommandHandler<CompleteProfessionalOnboardingCommand>
{
    public async Task<Result> Handle(
        CompleteProfessionalOnboardingCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Completing onboarding for professional with UserId: {UserId}", command.UserId);

        var specialization = await catalogOperations.FindSpecializationAsync(command.SpecializationId, cancellationToken);

        if (specialization is null)
        {
            logger.LogWarning("Specialization not found: {SpecializationId}", command.SpecializationId);
            return Result.Failure(ProfessionalErrors.SpecializationNotFound(command.SpecializationId));
        }

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

        var existingProfessional = await profileOperations.FindByUserIdAsync(command.UserId, cancellationToken);

        if (existingProfessional is not null)
        {
            existingProfessional.Update(
                specializationId: command.SpecializationId,
                experience: command.Experience);
            await profileOperations.SaveChangesAsync(cancellationToken);
            
            logger.LogInformation("Updated existing professional for UserId: {UserId}", command.UserId);
            return Result.Success();
        }

        var professional = new Professional(
            command.UserId,
            command.SpecializationId,
            command.Experience);

        profileOperations.Add(professional);
        await profileOperations.SaveChangesAsync(cancellationToken);

        var addClaimResult = await identityApi.AddClaimAsync(
            command.UserId, 
            "ProfessionalId", 
            professional.Id.ToString(), 
            cancellationToken);
        
        if (!addClaimResult.IsSuccess)
        {
            logger.LogWarning("Failed to add ProfessionalId claim for UserId: {UserId}", command.UserId);
        }

        logger.LogInformation("Professional onboarding completed successfully for UserId: {UserId}, ProfessionalId: {ProfessionalId}",
            command.UserId, professional.Id);

        return Result.Success();
    }
}
