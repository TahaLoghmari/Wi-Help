using Modules.Common.Features.Abstractions;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.SetupSchedule;

public record SetupScheduleCommand(List<AvailabilityDayDto> DayAvailabilities, Guid ProfessionalId, string TimeZoneId)
    : ICommand;