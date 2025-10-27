namespace Modules.Identity.Features.DTOs;

public record EmailDto(string ToEmail, string Subject, string Body, bool IsBodyHtml = false);