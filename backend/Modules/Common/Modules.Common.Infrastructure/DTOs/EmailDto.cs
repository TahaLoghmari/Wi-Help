namespace Modules.Common.Infrastructure.DTOs;

public record EmailDto(string ToEmail, string Subject, string Body, bool IsBodyHtml = false);
