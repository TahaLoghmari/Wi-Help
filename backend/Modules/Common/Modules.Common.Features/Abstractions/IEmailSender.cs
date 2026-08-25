using Modules.Common.Features.DTOs;

namespace Modules.Common.Features.Abstractions;

public interface IEmailSender
{
    Task SendEmailAsync(EmailDto email, CancellationToken cancellationToken);

    void EnqueueEmail(EmailDto email);
}
