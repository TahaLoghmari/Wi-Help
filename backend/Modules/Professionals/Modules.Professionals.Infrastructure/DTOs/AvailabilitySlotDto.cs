namespace Modules.Professionals.Infrastructure.DTOs;

public record AvailabilitySlotDto
{

    public Guid? Id { get; set; } = null;
    public string StartTime { get; set; } = null!;
    public string EndTime { get; set; } = null!;
}