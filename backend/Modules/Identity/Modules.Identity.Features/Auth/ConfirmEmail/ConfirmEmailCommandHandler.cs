using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain;

namespace Modules.Identity.Features.Auth.ConfirmEmail;

public sealed class ConfirmEmailCommandHandler(
    UserManager<User> userManager,
    ILogger<ConfirmEmailCommandHandler> logger) : ICommandHandler<ConfirmEmailCommand>
{
    public async Task<Result> Handle(
        ConfirmEmailCommand command,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);
        if (user is null)
        {
            logger.LogWarning("Email confirmation failed - user not found for UserId: {UserId}", 
                command.UserId);
            return Result.Failure(IdentityErrors.UserNotFound());
        }
        
        var result = await userManager.ConfirmEmailAsync(user, command.Token);
        
        if (!result.Succeeded)
        {
            logger.LogWarning("Email confirmation failed for UserId: {UserId}. Errors: {Errors}", 
                command.UserId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            return Result.Failure(IdentityErrors.InvalidConfirmationToken());
        }
        
        logger.LogInformation("Email confirmation successful for UserId: {UserId}", command.UserId);

        return Result.Success();
    }
}
