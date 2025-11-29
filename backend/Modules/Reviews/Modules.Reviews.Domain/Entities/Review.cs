namespace Modules.Reviews.Domain.Entities;

public class Review
{
    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public string Comment { get; private set; } = string.Empty;
    public int Rating { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Review() { }

    public Review(
        Guid patientId,
        Guid professionalId,
        string comment,
        int rating)
    {
        Id = Guid.NewGuid();
        PatientId = patientId;
        ProfessionalId = professionalId;
        Comment = comment;
        Rating = rating;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string? comment = null, int? rating = null)
    {
        if (!string.IsNullOrWhiteSpace(comment))
            Comment = comment;
        
        if (rating.HasValue)
            Rating = rating.Value;
        
        UpdatedAt = DateTime.UtcNow;
    }
}

