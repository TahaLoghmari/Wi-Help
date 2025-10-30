using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Domain.Entities;

public class Professional
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Specialization { get; private set; } = string.Empty;
    public int YearsOfExperience { get; private set; }
    public bool IsVerified { get; private set; }
    public Address Workplace { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    
    private Professional(){}

    public Professional(
        Guid userId,
        string specialization,
        int yearsOfExperience,
        Address address)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Specialization = specialization;
        YearsOfExperience = yearsOfExperience;
        IsVerified = false;
        Workplace = address;
        CreatedAt = DateTime.UtcNow;
    }
}