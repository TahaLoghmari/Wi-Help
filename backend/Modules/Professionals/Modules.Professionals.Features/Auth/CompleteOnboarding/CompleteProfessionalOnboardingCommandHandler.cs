using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Auth.CompleteOnboarding;

public sealed class CompleteProfessionalOnboardingCommandHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<CompleteProfessionalOnboardingCommandHandler> logger) : ICommandHandler<CompleteProfessionalOnboardingCommand>
{
    public async Task<Result> Handle(
        CompleteProfessionalOnboardingCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Completing onboarding for professional with UserId: {UserId}", command.UserId);

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

        // Check if professional already exists
        var existingProfessional = await dbContext.Professionals
            .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

        if (existingProfessional is not null)
        {
            // Update existing professional
            existingProfessional.Update(
                specialization: command.Specialization,
                experience: command.Experience);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            logger.LogInformation("Updated existing professional for UserId: {UserId}", command.UserId);
            return Result.Success();
        }

        // Create new professional
        var professional = new Professional(
            command.UserId,
            command.Specialization,
            command.Experience);

        dbContext.Professionals.Add(professional);
        await dbContext.SaveChangesAsync(cancellationToken);

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
