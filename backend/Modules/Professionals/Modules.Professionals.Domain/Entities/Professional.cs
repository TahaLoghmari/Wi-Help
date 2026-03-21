using Modules.Common.Features.ValueObjects;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Domain.Entities;

public class Professional
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public int VisitPrice { get; private set; }
    public string? Bio { get; set; } 
    public Guid SpecializationId { get; private set; }
    public int Experience { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    
    public VerificationStatus VerificationStatus { get; private set; }
    public Specialization Specialization { get; private set; } = null!;
    public ICollection<AvailabilityDay> AvailabilityDays { get; private set; } = new List<AvailabilityDay>();
    public ICollection<Service> Services { get; private set; } = new List<Service>();
    public ICollection<VerificationDocument> VerificationDocuments { get; private set; } = new List<VerificationDocument>();
    public ICollection<Award> Awards { get; private set; } = new List<Award>();
    public ICollection<Education> Educations { get; private set; } = new List<Education>();
    public ICollection<WorkExperience> WorkExperiences { get; private set; } = new List<WorkExperience>();
    
    private Professional(){}

    public Professional(
        Guid userId,
        Guid specializationId,
        int experience)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Experience = experience;
        SpecializationId = specializationId;
        VerificationStatus = VerificationStatus.Pending;
        VisitPrice = 30;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void UpdateVerificationStatus(VerificationStatus status)
    {
        VerificationStatus = status;

        UpdatedAt = DateTime.UtcNow;
    }
    
    public void Update(
        Guid? specializationId = null,
        int? experience = null,
        int? visitPrice = null,
        string? bio = null)
    {
        if (bio is not null)
            Bio = bio;
        
        UpdatedAt = DateTime.UtcNow;
        
        if (specializationId.HasValue)
            SpecializationId = specializationId.Value;
        
        if (experience.HasValue)
            Experience = experience.Value;
        
        if (visitPrice.HasValue)
            VisitPrice = visitPrice.Value;
    }

    public void UpdateServices(List<Service> newServices)
    {
        var newServiceIds = newServices.Select(s => s.Id).ToHashSet();
        var currentServiceIds = Services.Select(s => s.Id).ToHashSet();

        var toRemove = Services.Where(s => !newServiceIds.Contains(s.Id)).ToList();
        foreach (var service in toRemove)
            Services.Remove(service);

        var toAdd = newServices.Where(s => !currentServiceIds.Contains(s.Id));
        foreach (var service in toAdd)
            Services.Add(service);

        UpdatedAt = DateTime.UtcNow;
    }
}
