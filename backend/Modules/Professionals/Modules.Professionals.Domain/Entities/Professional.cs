using Modules.Common.Features.ValueObjects;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Domain.Entities;

public class Professional
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public int? VisitPrice { get; private set; }
    public string? Bio { get; set; } 
    public string Specialization { get; set; } = string.Empty;
    public int Experience { get; private set; }
    public bool IsVerified { get; private set; }
    public VerificationStatus VerificationStatus { get; private set; }
    public List<string>? Services { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public ICollection<AvailabilityDay> AvailabilityDays { get; private set; } = new List<AvailabilityDay>();
    public ICollection<VerificationDocument> VerificationDocuments { get; private set; } = new List<VerificationDocument>();
    public ICollection<Award> Awards { get; private set; } = new List<Award>();
    public ICollection<Education> Educations { get; private set; } = new List<Education>();
    public ICollection<WorkExperience> WorkExperiences { get; private set; } = new List<WorkExperience>();
    
    private Professional(){}

    public Professional(
        Guid userId,
        string specialization,
        int experience)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Experience = experience;
        Specialization = specialization;
        IsVerified = false;
        VerificationStatus = VerificationStatus.Pending;
        VisitPrice = 30; // Default visit price
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void UpdateVerificationStatus(VerificationStatus status)
    {
        VerificationStatus = status;
        IsVerified = status == VerificationStatus.Verified;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void Update(
        string? specialization = null,
        List<string>? services = null,
        int? experience = null,
        int? visitPrice = null,
        string? bio = null)
    {
        if (!string.IsNullOrWhiteSpace(specialization))
            Specialization = specialization;
        
            Services = services;
        
        if (experience.HasValue)
            Experience = experience.Value;
        
        if (visitPrice.HasValue)
            VisitPrice = visitPrice.Value;
            
        if (bio != null) 
            Bio = bio;
        
        UpdatedAt = DateTime.UtcNow;
    }
}
