using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Professionals.Domain;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Auth.RegisterProfessional;

public sealed class RegisterProfessionalCommandHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    ILogger<RegisterProfessionalCommandHandler> logger) : ICommandHandler<RegisterProfessionalCommand>
{
    public async Task<Result> Handle(
        RegisterProfessionalCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Professional registration attempt started for {Email}", command.Email);

        CreateUserRequest createUserRequest = new CreateUserRequest(
            command.Email,
            command.Password,
            command.FirstName,
            command.LastName,
            command.DateOfBirth,
            command.Gender,
            command.PhoneNumber,
            "Professional",
            command.Address);

        Result<Guid> createUserResult = await identityApi.CreateUserAsync(
            createUserRequest,
            cancellationToken);

        if (!createUserResult.IsSuccess)
        {
            logger.LogWarning("User creation failed for professional registration: {Email}", command.Email);
            return Result.Failure(createUserResult.Error);
        }

        Guid userId = createUserResult.Value;
        logger.LogInformation("User created successfully, creating professional profile for UserId: {UserId}", userId);

        var existingProfessional = await dbContext.Professionals.FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (existingProfessional is not null)
        {
            logger.LogWarning("Professional already exists for UserId: {UserId}", userId);
            return Result.Failure(ProfessionalErrors.AlreadyExists(userId));
        }

        var professional = new Professional(
            userId,
            command.Specialization,
            command.Experience);

        dbContext.Professionals.Add(professional);
        await dbContext.SaveChangesAsync(cancellationToken);

        var addClaimResult = await identityApi.AddClaimAsync(userId, "ProfessionalId", professional.Id.ToString(), cancellationToken);
        if (!addClaimResult.IsSuccess)
        {
            logger.LogWarning("Failed to add ProfessionalId claim for UserId: {UserId}", userId);
            // Maybe not fail the registration, just log
        }

        logger.LogInformation("Professional registration completed successfully for UserId: {UserId}, ProfessionalId: {ProfessionalId}",
            userId, professional.Id);

        return Result.Success();
    }
}
