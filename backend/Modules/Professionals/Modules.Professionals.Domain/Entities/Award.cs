namespace Modules.Professionals.Domain.Entities;

public class Award
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Issuer { get; private set; }
    public string? Description { get; private set; }
    public string YearReceived { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public Professional Professional { get; private set; } = null!;

    private Award() { }

    public Award(
        Guid professionalId,
        string title,
        string? issuer,
        string? description,
        string yearReceived)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        Title = title;
        Issuer = issuer;
        Description = description;
        YearReceived = yearReceived;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? title = null,
        string? issuer = null,
        string? description = null,
        string? yearReceived = null)
    {
        if (!string.IsNullOrWhiteSpace(title))
            Title = title;

        if (issuer is not null)
            Issuer = issuer;

        if (description is not null)
            Description = description;

        if (!string.IsNullOrWhiteSpace(yearReceived))
            YearReceived = yearReceived;

        UpdatedAt = DateTime.UtcNow;
    }
}
