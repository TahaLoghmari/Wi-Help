namespace Modules.Professionals.Features.Awards;

public sealed record AwardDto(
    Guid Id,
    string Title,
    string? Issuer,
    string? Description,
    string YearReceived,
    DateTime CreatedAt,
    DateTime UpdatedAt);
