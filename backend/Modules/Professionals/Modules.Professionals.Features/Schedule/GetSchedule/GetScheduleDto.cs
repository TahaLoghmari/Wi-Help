using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleDto
{
    public string TimeZoneId { get; init; } = "Africa/Tunis";
    public List<AvailabilityDayDto> Days { get; init; } = [];
}