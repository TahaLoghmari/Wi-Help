using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Domain;

namespace Modules.Identity.Features.Auth.ResetPassword;

internal sealed class ResetPasswordCommandHandler(
    UserManager<User> userManager,
    ILogger<ResetPasswordCommandHandler> logger)
    : ICommandHandler<ResetPasswordCommand>
{
    public async Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Password reset processing for {Email}", request.Email);

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            logger.LogWarning("Password reset failed - user not found for {Email}", request.Email);
            // Return success to avoid enumeration, or failure if you prefer.
            // The user's example threw BadRequestException.
            // Here we use Result pattern.
            return Result.Failure(IdentityErrors.UserNotFound());
        }

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

        if (!result.Succeeded)
        {
            logger.LogWarning("Password reset failed for {Email}, UserId: {UserId}. Errors: {Errors}",
                user.Email, user.Id,
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));

            // Map Identity errors to Result errors
            // For simplicity, returning a generic error or the first one.
            // Ideally we should map all errors.
            return Result.Failure(Error.Failure("Identity.ResetPasswordFailed", "Password reset failed."));
        }

        logger.LogInformation("Password reset successful for {Email}, UserId: {UserId}",
            user.Email, user.Id);

        return Result.Success();
    }
}
