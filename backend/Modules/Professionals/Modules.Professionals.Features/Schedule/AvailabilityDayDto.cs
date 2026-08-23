namespace Modules.Professionals.Features.Schedule;

public record AvailabilityDayDto
{
    public DayOfWeek DayOfWeek { get; init; }
    public bool IsActive { get; init; }
    public List<AvailabilitySlotDto> AvailabilitySlots { get; init; } = [];
}
