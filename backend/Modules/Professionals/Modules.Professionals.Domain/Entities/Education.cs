namespace Modules.Professionals.Domain.Entities;

public class Education
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Institution { get; private set; } = string.Empty;
    public string Degree { get; private set; } = string.Empty;
    public string FieldOfStudy { get; private set; } = string.Empty;
    public Guid CountryId { get; private set; }
    public string Description { get; private set; } = string.Empty;
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
        string fieldOfStudy,
        Guid countryId,
        string description,
        string startYear,
        string? endYear,
        bool isCurrentlyStudying = false)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        Institution = institution;
        Degree = degree;
        FieldOfStudy = fieldOfStudy;
        CountryId = countryId;
        Description = description;
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
        Guid? countryId = null,
        string? description = null,
        string? startYear = null,
        string? endYear = null,
        bool? isCurrentlyStudying = null)
    {
        if (!string.IsNullOrWhiteSpace(institution))
            Institution = institution;

        if (!string.IsNullOrWhiteSpace(degree))
            Degree = degree;

        if (!string.IsNullOrWhiteSpace(fieldOfStudy))
            FieldOfStudy = fieldOfStudy;

        if (countryId.HasValue)
            CountryId = countryId.Value;

        if (description is not null)
            Description = description;

        if (!string.IsNullOrWhiteSpace(startYear))
            StartYear = startYear;

        if (isCurrentlyStudying.HasValue)
        {
            IsCurrentlyStudying = isCurrentlyStudying.Value;
            if (isCurrentlyStudying.Value)
                EndYear = null;
        }

        if (endYear is not null)
            EndYear = endYear;

        UpdatedAt = DateTime.UtcNow;
    }
}
