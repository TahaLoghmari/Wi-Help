using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain.Errors;

namespace Modules.Identity.Features.Auth.Register;

public sealed class RegisterCommandHandler(
    UserManager<User> userManager,
    ILogger<RegisterCommandHandler> logger,
    EmailService emailService) : ICommandHandler<RegisterCommand>
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
                command.Email);

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
        
        // Profile creation can be handled here via a public API call 
        
        logger.LogInformation("Confirmation email job enqueued for user {UserId}", user.Id);
        
        return Result.Success();
    }
}