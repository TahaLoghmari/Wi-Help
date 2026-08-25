namespace Modules.Common.Features.DTOs;

public record EmailDto(string ToEmail, string Subject, string Body, bool IsBodyHtml = false);
