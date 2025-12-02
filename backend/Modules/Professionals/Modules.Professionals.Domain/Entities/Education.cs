namespace Modules.Professionals.Domain.Entities;

public class Education
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Institution { get; private set; } = string.Empty;
    public string Degree { get; private set; } = string.Empty;
    public string? FieldOfStudy { get; private set; }
    public string? Country { get; private set; }
    public string StartYear { get; private set; } = string.Empty;
    public string? EndYear { get; private set; }
    public bool IsCurrentlyStudying { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public Professional Professional { get; private set; } = null!;

    private Education() { }

    public Education(
        Guid professionalId,
        string institution,
        string degree,
        string? fieldOfStudy,
        string? country,
        string startYear,
        string? endYear,
        bool isCurrentlyStudying = false)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        Institution = institution;
        Degree = degree;
        FieldOfStudy = fieldOfStudy;
        Country = country;
        StartYear = startYear;
        EndYear = endYear;
        IsCurrentlyStudying = isCurrentlyStudying;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? institution = null,
        string? degree = null,
        string? fieldOfStudy = null,
        string? country = null,
        string? startYear = null,
        string? endYear = null,
        bool? isCurrentlyStudying = null)
    {
        if (!string.IsNullOrWhiteSpace(institution))
            Institution = institution;

        if (!string.IsNullOrWhiteSpace(degree))
            Degree = degree;

        if (fieldOfStudy is not null)
            FieldOfStudy = fieldOfStudy;

        if (country is not null)
            Country = country;

        if (!string.IsNullOrWhiteSpace(startYear))
            StartYear = startYear;

        if (endYear is not null)
            EndYear = endYear;

        if (isCurrentlyStudying.HasValue)
            IsCurrentlyStudying = isCurrentlyStudying.Value;

        UpdatedAt = DateTime.UtcNow;
    }
}
