using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Modules.Common.Infrastructure.DTOs;
using Modules.Common.Infrastructure.Services;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Templates;

namespace Modules.Identity.Infrastructure.Services;

public sealed class IdentityEmailService(
    UserManager<User> userManager,
    ILogger<IdentityEmailService> logger,
    EmailService emailService,
    IConfiguration configuration)
{
    public async Task SendForgotPasswordEmail(string email, User user)
    {
        logger.LogInformation("Attempting to send password reset email for user {UserId} to {Email}", user.Id, email);
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        logger.LogInformation("Generated password reset token for user {UserId}", user.Id);
        
        var baseUrl = configuration["VITE_API_URL"] ?? "http://localhost:5000";
        var passwordResetLink = $"{baseUrl}/auth/reset-password?Email={Uri.EscapeDataString(email)}&Token={Uri.EscapeDataString(token)}";
        
        if (string.IsNullOrEmpty(passwordResetLink))
        {
            logger.LogError("Password reset link generation failed for user {UserId}. The generated link was null.", user.Id);
            return;
        }

        logger.LogInformation("Successfully generated password reset link for user {UserId}", user.Id);
        
        var safeLink = HtmlEncoder.Default.Encode(passwordResetLink);

        var subject = "Reset Your Password";

        EmailDto sendEmailDto = new EmailDto(email, subject, EmailTemplates.PasswordReset(user.UserName!, passwordResetLink), true);
        
        emailService.EnqueueEmail(sendEmailDto);

        logger.LogInformation("Password reset email queued for user {UserId}", user.Id);
    }
    
    public async Task SendConfirmationEmail(User user)
    {
        logger.LogInformation("Generated email confirmation token for user {UserId}", user.Id);
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        logger.LogInformation("Generated email confirmation token for user {UserId}", user.Id);
        
        var baseUrl = configuration["VITE_API_URL"] ?? "http://localhost:5000";
        var confirmationLink = $"{baseUrl}/auth/confirm-email?UserId={Uri.EscapeDataString(user.Id.ToString())}&Token={Uri.EscapeDataString(token)}";

        if (string.IsNullOrEmpty(confirmationLink))
        {
            logger.LogError("Email confirmation link generation failed for user {UserId}. The generated link was null.", user.Id);
            return;
        }
        
        logger.LogInformation("Successfully generated email confirmation link for user {UserId}", user.Id);
        var safeLink = HtmlEncoder.Default.Encode(confirmationLink);

        var subject = "Welcome to Wi Help! Please Confirm Your Email";

        EmailDto sendEmailDto = new EmailDto(user.Email!, subject, EmailTemplates.EmailConfirmation(user.UserName!, confirmationLink), true);

        emailService.EnqueueEmail(sendEmailDto);
        
        logger.LogInformation("Confirmation email queued for user {UserId}", user.Id);
    }
}
