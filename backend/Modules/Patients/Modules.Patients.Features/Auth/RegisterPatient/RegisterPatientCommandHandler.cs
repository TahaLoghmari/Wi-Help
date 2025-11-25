using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi;
using Modules.Identity.PublicApi.Contracts;
using Modules.Patients.Domain;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.Auth.RegisterPatient;

public sealed class RegisterPatientCommandHandler(
    IIdentityModuleApi identityApi,
    PatientsDbContext dbContext,
    ILogger<RegisterPatientCommandHandler> logger) : ICommandHandler<RegisterPatientCommand>
{
    public async Task<Result> Handle(
        RegisterPatientCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Patient registration attempt started for {Email}", command.Email);

        CreateUserRequest createUserRequest = new CreateUserRequest(
            command.Email,
            command.Password,
            command.FirstName,
            command.LastName,
            command.DateOfBirth,
            command.Gender,
            command.PhoneNumber,
            "Patient",
            command.Address);

        Result<Guid> createUserResult = await identityApi.CreateUserAsync(
            createUserRequest,
            cancellationToken);

        if (!createUserResult.IsSuccess)
        {
            logger.LogWarning("User creation failed for patient registration: {Email}", command.Email);
            return Result.Failure(createUserResult.Error);
        }

        Guid userId = createUserResult.Value;
        logger.LogInformation("User created successfully, creating patient profile for UserId: {UserId}", userId);

        var existingPatient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (existingPatient is not null)
        {
            logger.LogWarning("Patient already exists for UserId: {UserId}", userId);
            return Result.Failure(PatientErrors.AlreadyExists(userId));
        }

        var patient = new Patient(userId, command.EmergencyContact);

        dbContext.Patients.Add(patient);
        await dbContext.SaveChangesAsync(cancellationToken);

        var addClaimResult = await identityApi.AddClaimAsync(userId, "PatientId", patient.Id.ToString(), cancellationToken);
        if (!addClaimResult.IsSuccess)
        {
            logger.LogWarning("Failed to add PatientId claim for UserId: {UserId}", userId);
            // Maybe not fail the registration, just log
        }

        logger.LogInformation("Patient registration completed successfully for UserId: {UserId}, PatientId: {PatientId}",
            userId, patient.Id);

        return Result.Success();
    }
}
