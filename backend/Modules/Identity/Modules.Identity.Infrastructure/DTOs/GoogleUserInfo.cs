namespace Modules.Identity.Infrastructure.DTOs;

public sealed record GoogleUserInfo(
    string Id,
    string Email,
    string? Name,
    string? GivenName,
    string? FamilyName,
    string? Picture);
