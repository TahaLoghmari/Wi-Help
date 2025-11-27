using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleDto
{
    public List<AvailabilityDayDto> Days { get; init; } = [];
}