namespace Modules.Professionals.Features.Educations;

public sealed record EducationDto(
    Guid Id,
    string Institution,
    string Degree,
    string FieldOfStudy,
    Guid CountryId,
    string Description,
    string StartYear,
    string? EndYear,
    bool IsCurrentlyStudying,
    DateTime CreatedAt,
    DateTime UpdatedAt);
