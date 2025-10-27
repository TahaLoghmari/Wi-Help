using System.Net.Mail; 
using System.Net;
using System.Text.Encodings.Web;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Features.DTOs;
using Modules.Identity.Infrastructure.Settings;
using Modules.Identity.Infrastructure.Templates;

namespace backend.Services;
public sealed class EmailService(
    IOptions<EmailSettings> emailSettings,
    UserManager<User> userManager,
    ILogger<EmailService> logger,
    IBackgroundJobClient backgroundJobClient,
    IHttpContextAccessor httpContextAccessor,
    IUrlHelperFactory urlHelperFactory)
{
    private readonly EmailSettings _emailSettings = emailSettings.Value;

    public async Task SendEmailAsync(
        EmailDto sendEmailDto,
        CancellationToken cancellationToken)
    {

        string? mailServer = _emailSettings.MailServer;

        string? fromEmail = _emailSettings.FromEmail;

        string? password = _emailSettings.Password;

        string? senderName = _emailSettings.SenderName;

        int port = Convert.ToInt32(_emailSettings.MailPort);

        var client = new SmtpClient(mailServer, port)
        {
            Credentials = new NetworkCredential(fromEmail, password),
            EnableSsl = true,
        };
        MailAddress fromAddress = new MailAddress(fromEmail, senderName);
        
        MailMessage mailMessage = new MailMessage
        {
            From = fromAddress, 
            Subject = sendEmailDto.Subject, 
            Body = sendEmailDto.Body, 
            IsBodyHtml = sendEmailDto.IsBodyHtml 
        };

        mailMessage.To.Add(sendEmailDto.ToEmail);
        
        await client.SendMailAsync(mailMessage,cancellationToken);
        
        logger.LogInformation("Email sent successfully to {Email}", sendEmailDto.ToEmail);
    }
    public async Task SendForgotPasswordEmail(string email,
        User user)
    {
        logger.LogInformation("Attempting to send password reset email for user {UserId} to {Email}", user.Id, email);
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        logger.LogInformation("Generated password reset token for user {UserId}", user.Id);
        
        var httpContext = httpContextAccessor.HttpContext!;

        var url = urlHelperFactory.GetUrlHelper(new ActionContext(
            httpContext,
            httpContext.GetRouteData(),
            new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()));

        var passwordResetLink = url.Action("GetResetPasswordPage", "Auth",
            new { Email = email, Token = token }, protocol: httpContext.Request.Scheme);
        
        if (passwordResetLink is null)
        {
            logger.LogError("Password reset link generation failed for user {UserId}. The generated link was null.", user.Id);
            return;
        }

        logger.LogInformation("Successfully generated password reset link for user {UserId}", user.Id);
        
        var safeLink = HtmlEncoder.Default.Encode(passwordResetLink);

        var subject = "Reset Your Password";

        EmailDto sendEmailDto = new EmailDto(email, subject, EmailTemplates.PasswordReset(user.UserName!,passwordResetLink), true);
        
        backgroundJobClient.Enqueue(() => SendEmailAsync(sendEmailDto, CancellationToken.None));

        logger.LogInformation("Password reset email queued for user {UserId}", user.Id);
    }
    public async Task SendConfirmationEmail(
        User user)
    {
        logger.LogInformation("Generated email confirmation token for user {UserId}", user.Id);
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        logger.LogInformation("Generated email confirmation token for user {UserId}", user.Id);
        
        var httpContext = httpContextAccessor.HttpContext!;

        var url = urlHelperFactory.GetUrlHelper(new ActionContext(
            httpContext,
            httpContext.GetRouteData(),
            new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()));

        var confirmationLink = url.Action("ConfirmEmail", "Auth",
            new { UserId = user.Id, Token = token }, protocol: httpContext.Request.Scheme);

        if (confirmationLink is null)
        {
            logger.LogError("Email confirmation link generation failed for user {UserId}. The generated link was null.", user.Id);
            return;
        }
        
        logger.LogInformation("Successfully generated email confirmation link for user {UserId}", user.Id);
        var safeLink = HtmlEncoder.Default.Encode(confirmationLink);

        var subject = "Welcome to SmartPly! Please Confirm Your Email";

        EmailDto sendEmailDto = new EmailDto(user.Email!, subject, EmailTemplates.EmailConfirmation(user.UserName!,confirmationLink), true);

        backgroundJobClient.Enqueue(() => SendEmailAsync(sendEmailDto, CancellationToken.None));
        
        logger.LogInformation("Confirmation email queued for user {UserId}", user.Id);
    }
    
}
