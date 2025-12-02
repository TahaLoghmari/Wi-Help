namespace Modules.Professionals.Domain.Entities;

public class WorkExperience
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Organization { get; private set; } = string.Empty;
    public string? Location { get; private set; }
    public string? Description { get; private set; }
    public string StartYear { get; private set; } = string.Empty;
    public string? EndYear { get; private set; }
    public bool IsCurrentPosition { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public Professional Professional { get; private set; } = null!;

    private WorkExperience() { }

    public WorkExperience(
        Guid professionalId,
        string title,
        string organization,
        string? location,
        string? description,
        string startYear,
        string? endYear,
        bool isCurrentPosition = false)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        Title = title;
        Organization = organization;
        Location = location;
        Description = description;
        StartYear = startYear;
        EndYear = endYear;
        IsCurrentPosition = isCurrentPosition;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? title = null,
        string? organization = null,
        string? location = null,
        string? description = null,
        string? startYear = null,
        string? endYear = null,
        bool? isCurrentPosition = null)
    {
        if (!string.IsNullOrWhiteSpace(title))
            Title = title;

        if (!string.IsNullOrWhiteSpace(organization))
            Organization = organization;

        if (location is not null)
            Location = location;

        if (description is not null)
            Description = description;

        if (!string.IsNullOrWhiteSpace(startYear))
            StartYear = startYear;

        if (endYear is not null)
            EndYear = endYear;

        if (isCurrentPosition.HasValue)
            IsCurrentPosition = isCurrentPosition.Value;

        UpdatedAt = DateTime.UtcNow;
    }
}
