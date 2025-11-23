using FluentValidation;

namespace Modules.Professionals.Features.Schedule.Setup;

public class SetupScheduleCommandValidator : AbstractValidator<SetupScheduleCommand>
{
    public SetupScheduleCommandValidator()
    {
        RuleForEach(c => c.DayAvailabilities).ChildRules(dayAvailability =>
        {
            /*dayAvailability.RuleFor(da => da.DayOfWeek)
                .IsInEnum().WithMessage("Invalid day of the week.");*/

            dayAvailability.RuleForEach(da => da.AvailabilitySlot).ChildRules(range =>
            {
                range.RuleFor(r => r.StartTime)
                    .NotEmpty().WithMessage("Start time is required.")
                    .Matches(@"^([01]\d|2[0-3]):([0-5]\d)$").WithMessage("Start time must be in HH:mm format.");

                range.RuleFor(r => r.EndTime)
                    .NotEmpty().WithMessage("End time is required.")
                    .Matches(@"^([01]\d|2[0-3]):([0-5]\d)$").WithMessage("End time must be in HH:mm format.");

                range.RuleFor(r => r)
                    .Must(r =>
                    {
                        if (TimeSpan.TryParse(r.StartTime, out var start) && TimeSpan.TryParse(r.EndTime, out var end))
                        {
                            return start < end;
                        }

                        return false;
                    })
                    .WithMessage("Start time must be earlier than end time.");
            });

            dayAvailability.RuleFor(da => da.AvailabilitySlot)
                .Must(slots =>
                {
                    var parsedSlots = slots
                        .Select(s => new
                        {
                            Start = TimeSpan.TryParse(s.StartTime, out var start) ? start : (TimeSpan?)null,
                            End = TimeSpan.TryParse(s.EndTime, out var end) ? end : (TimeSpan?)null
                        })
                        .Where(s => s.Start.HasValue && s.End.HasValue)
                        .Select(s => new { Start = s.Start!.Value, End = s.End!.Value })
                        .OrderBy(s => s.Start)
                        .ToList();

                    for (int i = 0; i < parsedSlots.Count - 1; i++)
                    {
                        if (parsedSlots[i].End > parsedSlots[i + 1].Start)
                        {
                            return false;
                        }
                    }
                    return true;
                })
                .WithMessage("Availability slots must not overlap.");
        });
    }
}