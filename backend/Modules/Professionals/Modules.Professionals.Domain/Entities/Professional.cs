using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Domain.Entities;

public class Professional
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public int StartPrice { get; private set; }
    public int EndPrice { get; private set; }
    public string Bio { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public int Experience { get; private set; }
    public bool IsVerified { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public List<string> Services { get; private set; } = new List<string>();
    
    private Professional(){}

    public Professional(
        Guid userId,
        string specialization,
        int experience)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        StartPrice = 0;
        EndPrice = 0;
        Bio = "";
        Experience = experience;
        Specialization = specialization;
        IsVerified = false;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        Services = new List<string>();
    }
    
    public void Update(
        string? specialization = null,
        List<string>? services = null,
        int? experience = null,
        int? startPrice = null,
        int? endPrice = null,
        string? bio = null)
    {
        if (!string.IsNullOrWhiteSpace(specialization))
            Specialization = specialization;
        
        if (services != null && services.Count > 0)
            Services = services;
        
        if (experience.HasValue)
            Experience = experience.Value;
        
        if (startPrice.HasValue)
            StartPrice = startPrice.Value;
        
        if (endPrice.HasValue)
            EndPrice = endPrice.Value;
        
        if (!string.IsNullOrWhiteSpace(bio))
            Bio = bio;
        
        UpdatedAt = DateTime.UtcNow;
    }
}
