namespace Modules.Professionals.Features.Schedule;

public record AvailabilitySlotDto
{
    public Guid? Id { get; set; }
    public string StartTime { get; set; } = null!;
    public string EndTime { get; set; } = null!;
}
