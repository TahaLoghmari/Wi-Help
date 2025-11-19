using backend.Services;
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

namespace Modules.Identity.Features.Auth.Register;

public sealed class RegisterCommandHandler(
    UserManager<User> userManager,
    ILogger<RegisterCommandHandler> logger,
    EmailService emailService,
    IPatientsModuleApi patientApi,
    IProfessionalModuleApi professionalApi) : ICommandHandler<RegisterCommand>
{
    public async Task<Result> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("User registration attempt started for {@Email}", command.Email);

        var existingUser = await userManager.FindByEmailAsync(command.Email);
        if (existingUser != null )
        {
            logger.LogWarning("Registration failed - email already exists: {Email}.",command.Email);
            return Result.Failure(RegisterErrors.UserExists());
        }

        User user = User.Create(
                command.FirstName,
                command.LastName,
                command.DateOfBirth,
                command.Gender,
                command.PhoneNumber,
                command.Email,
                command.Address);

        IdentityResult result = await userManager.CreateAsync(user, command.Password);

        if (!result.Succeeded)
        {
            logger.LogError("User registration failed for {Email}. Errors: {Errors}",
                command.Email,
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(RegisterErrors.InvalidInput());
        }

        logger.LogInformation("User registration successful for {Email}, UserId: {UserId}",
            command.Email, user.Id);
        
        await emailService.SendConfirmationEmail(user);
        
        await userManager.AddToRoleAsync(user, command.Role);

        if (string.Equals(command.Role, "Patient", StringComparison.OrdinalIgnoreCase))
        {
            CreatePatientRequest patientRequest = new CreatePatientRequest(
                user.Id,
                command.EmergencyContact!
            );
            
            Result createPatientResult = await patientApi.CreatePatientAsync(
                patientRequest,
                cancellationToken);

            if (!createPatientResult.IsSuccess)
            {
                return Result.Failure(createPatientResult.Error);
            }
        }
        else if (string.Equals(command.Role, "Professional", StringComparison.OrdinalIgnoreCase))
        {
            CreateProfessionalRequest professionalRequest = new CreateProfessionalRequest(
                user.Id,
                command.Specialization!,
                command.YearsOfExperience!.Value
            );
            
            Result createProfessionalRequest = await professionalApi.CreateProfessionalAsync(
                professionalRequest,
                cancellationToken);

            if (!createProfessionalRequest.IsSuccess)
            {
                return Result.Failure(createProfessionalRequest.Error);
            }
        }
        
        logger.LogInformation("Confirmation email job enqueued for user {UserId}", user.Id);
        
        return Result.Success();
    }
}