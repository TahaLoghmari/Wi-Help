using Modules.Common.Features.Abstractions;
using Modules.Professionals.Features.Schedule;

namespace Modules.Professionals.Features.Schedule.SetupSchedule;

public record SetupScheduleCommand(List<AvailabilityDayDto> DayAvailabilities, Guid ProfessionalId)
    : ICommand;
