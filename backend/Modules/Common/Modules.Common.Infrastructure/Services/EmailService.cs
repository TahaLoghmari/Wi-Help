using System.Net;
using System.Net.Mail;
using Hangfire;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Modules.Common.Infrastructure.DTOs;
using Modules.Common.Infrastructure.Settings;

namespace Modules.Common.Infrastructure.Services;

public sealed class EmailService(
    IOptions<EmailSettings> emailSettings,
    ILogger<EmailService> logger,
    IBackgroundJobClient backgroundJobClient)
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
        
        await client.SendMailAsync(mailMessage, cancellationToken);
        
        logger.LogInformation("Email sent successfully to {Email}", sendEmailDto.ToEmail);
    }

    public void EnqueueEmail(EmailDto emailDto)
    {
        backgroundJobClient.Enqueue(() => SendEmailAsync(emailDto, CancellationToken.None));
        logger.LogInformation("Email queued for {Email}", emailDto.ToEmail);
    }
}
