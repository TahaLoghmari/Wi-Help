using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Services;

namespace Modules.Identity.Features.Auth.ForgotPassword;

internal sealed class ForgotPasswordCommandHandler(
    UserManager<User> userManager,
    IdentityEmailService emailService,
    ILogger<ForgotPasswordCommandHandler> logger)
    : ICommandHandler<ForgotPasswordCommand>
{
    public async Task<Result> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Forgot password requested for {Email}", request.Email);

        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null)
        {
            // Don't reveal that the user does not exist
            logger.LogWarning("Forgot password failed - user not found for {Email}", request.Email);
            return Result.Success();
        }

        await emailService.SendForgotPasswordEmail(user.Email!, user);

        logger.LogInformation("Password reset email sent to {Email}, UserId: {UserId}",
            user.Email, user.Id);

        return Result.Success();
    }
}
