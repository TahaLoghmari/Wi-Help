namespace Modules.Professionals.Infrastructure.DTOs;

public record AvailabilityDayDto
{
    public DayOfWeek DayOfWeek { get; init; }
    public bool IsActive { get; init; }
    public List<AvailabilitySlotDto> AvailabilitySlots { get; init; } = [];
}
