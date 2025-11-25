namespace Modules.Professionals.Domain.Entities;

public class AvailabilityDay
{
    public Guid Id { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public DayOfWeek DayOfWeek { get; private set; }
    public string TimeZone { get; private set; } = "Africa/Tunis";
    public bool IsActive { get; private set; }
    public Professional Professional { get; private set; } = null!;
    public ICollection<AvailabilitySlot> AvailabilitySlots { get; private set; } = new List<AvailabilitySlot>();

    public AvailabilityDay(
        Guid professionalId,
        DayOfWeek dayOfWeek,
        bool isActive,
        string timeZone)
    {
        Id = Guid.NewGuid();
        ProfessionalId = professionalId;
        DayOfWeek = dayOfWeek;
        IsActive = isActive;
        TimeZone = timeZone;
    }

    public void SetActiveStatus(bool isActive)
    {
        IsActive = isActive;
    }

    public void SetTimeZone(string timeZone)
    {
        TimeZone = timeZone;
    }
}