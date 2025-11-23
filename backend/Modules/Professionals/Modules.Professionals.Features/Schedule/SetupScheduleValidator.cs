using FluentValidation;

namespace Modules.Professionals.Features.Schedule;

public class SetupScheduleCommandValidator : AbstractValidator<SetupScheduleCommand>
{
    public SetupScheduleCommandValidator()
    {
        RuleForEach(c => c.DayAvailabilities).ChildRules(dayAvailability =>
        {
            /*dayAvailability.RuleFor(da => da.DayOfWeek)
                .IsInEnum().WithMessage("Invalid day of the week.");*/

            dayAvailability.RuleForEach(da => da.AvailabilityRanges).ChildRules(range =>
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
        });
    }
}