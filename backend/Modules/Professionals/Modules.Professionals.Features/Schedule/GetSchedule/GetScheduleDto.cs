using Modules.Professionals.Features.Schedule;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleDto
{
    public List<AvailabilityDayDto> Days { get; init; } = [];
}
