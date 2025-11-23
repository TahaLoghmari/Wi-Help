namespace Modules.Professionals.Infrastructure.DTOs;

public record DayAvailabilityDto
{
    public DayOfWeek DayOfWeek { get; init; }
    public bool IsActive { get; init; }
    
    public List<AvailabilitySlotDto> AvailabilitySlot { get; init; } = [];
}
