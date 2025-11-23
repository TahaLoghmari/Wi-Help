namespace Modules.Professionals.Domain.Entities;

public class AvailabilityDay
{
    public Guid Id { get; set; }
    public Guid ProfessionalId { get; private set; } // foreign key to Professional
    
    public DayOfWeek DayOfWeek { get; private set; }
    
    public bool IsActive { get; private set; }
    
    
    // Navigation property
    public Professional Professional { get; private set; } = null!;
    public ICollection<AvailabilitySlot> AvailabilitySlots { get; private set; } = new List<AvailabilitySlot>();
    
    
    // domain methods
    
    public void SetActiveStatus(bool isActive)
    {
        IsActive = isActive;
    }
}