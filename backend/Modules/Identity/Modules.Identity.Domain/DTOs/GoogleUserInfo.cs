namespace Modules.Identity.Domain.DTOs;

public sealed record GoogleUserInfo(
    string Id,
    string Email,
    string? Name,
    string? GivenName,
    string? FamilyName,
    string? Picture);
