namespace Modules.Professionals.Infrastructure.DTOs;

public record ScheduleDto
{
    public string TimeZoneId { get; init; } = "Africa/Tunis";
    public List<DayAvailabilityDto> Days { get; init; } = [];
}