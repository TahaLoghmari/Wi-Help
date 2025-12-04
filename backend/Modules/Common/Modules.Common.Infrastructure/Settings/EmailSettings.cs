namespace Modules.Common.Infrastructure.Settings;

public class EmailSettings
{
    public required string MailServer { get; init; }
    public required string SenderName { get; init; }
    public required string Password { get; init; }
    public required string FromEmail { get; init; }
    public int MailPort { get; init; }
}
