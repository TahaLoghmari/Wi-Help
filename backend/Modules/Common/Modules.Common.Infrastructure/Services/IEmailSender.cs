using Modules.Common.Infrastructure.DTOs;

namespace Modules.Common.Infrastructure.Services;

public interface IEmailSender
{
    Task SendEmailAsync(EmailDto email, CancellationToken cancellationToken);

    void EnqueueEmail(EmailDto email);
}
