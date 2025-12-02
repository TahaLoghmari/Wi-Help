namespace Modules.Professionals.Features.Experiences;

public sealed record ExperienceDto(
    Guid Id,
    string Title,
    string Organization,
    string? Location,
    string? Description,
    string StartYear,
    string? EndYear,
    bool IsCurrentPosition,
    DateTime CreatedAt,
    DateTime UpdatedAt);
