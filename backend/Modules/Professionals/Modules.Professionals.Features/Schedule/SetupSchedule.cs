using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Schedule;
public sealed record DayAvailability
{
    public DayOfWeek DayOfWeek { get; init; }
    public bool IsActive { get; init; }
    public List<AvailabilityRange> AvailabilityRanges { get; init; }
}

public sealed record AvailabilityRange
{
    public Guid? Id { get; init; } = null;
    public string StartTime { get; init; }
    public string EndTime { get; init; }
}
public class SetupSchedule : IEndpoint
{
    public record Request
    {
        public Guid ProfessionalId { get; init; }
        public string TimeZoneId { get; init; } = "Africa/Tunis";
        public List<DayAvailability>? DayAvailabilities { get; init; }
    }



    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("", async (Request request) => { }).RequireAuthorization();
    }
}

public class SetupScheduleCommandHandler(
    ProfessionalsDbContext professionalsDbContext,
    ILogger<SetupScheduleCommand> logger) : ICommandHandler<SetupScheduleCommand>
{
    public async Task Handle(SetupScheduleCommand command, CancellationToken cancellationToken)
    {

    

        try
        {
            logger.LogInformation("Setting schedule for session product {SessionProductId}", sessionProductId);

            var exisitingDayAvailabilities = await professionalsDbContext.AvailabilityDays.Include(ad => ad.AvailabilitySlots)
                .ToListAsync(cancellationToken);

            

            foreach (var dayRequest in command.DayAvailabilities)
            {
                
                var availabilityDay = exisitingDayAvailabilities.Find(exD => exD.DayOfWeek == dayRequest.DayOfWeek);
                if (availabilityDay is null) continue;
                
                // Update day active status 
                availabilityDay.SetActiveStatus(dayRequest.IsActive);
                // Skip creating time slots for inactive days
                if (!dayRequest.IsActive) continue;

                // Remove existing availabilities for this day
                var existingAvailabilities = await professionalsDbContext.AvailabilitySlots
                    .Where(a => a.AvailabilityDayId == availabilityDay.Id)
                    .ToListAsync(cancellationToken);

                professionalsDbContext.AvailabilitySlots.RemoveRange(existingAvailabilities);

                // Create new availabilities
                foreach (var timeSlot in dayRequest.AvailabilityRanges)
                {
                    if (!TimeOnly.TryParseExact(
                            timeSlot.StartTime,
                            "HH:mm",
                            out var timeStart) ||
                        !TimeOnly.TryParseExact(
                            timeSlot.EndTime,
                            "HH:mm",
                            out var timeEnd))
                    {
                        logger.LogWarning(
                            "Invalid time format for slot {StartTime}-{EndTime}",
                            timeSlot.StartTime,
                            timeSlot.EndTime);
                        continue;
                    }

                    var totalMinutes = (timeEnd - timeStart).TotalMinutes;
                    if (totalMinutes % 30 != 0)
                    {
                        logger.LogWarning(
                            "Time range must be in 30-minute increments: {StartTime}-{EndTime}",
                            timeSlot.StartTime,
                            timeSlot.EndTime);
                        continue;
                    }

                    // TODO : What happens if this was created  : now its prevened from the frontend 
                    //  9-12
                    //  10-14


                    var availability = AvailabilitySlot.Create(
                        availabilityDay.Id,
                        timeStart,
                        timeEnd);

                    await professionalsDbContext.AvailabilitySlots.AddAsync(availability, cancellationToken);
                }
            }

            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Successfully set schedule for session product {SessionProductId}", sessionProductId);
            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to set schedule for session product {SessionProductId}",
                sessionProductId);
            return Result.Failure(
                Error.Problem(
                    "SessionProduct.ScheduleSetFailed",
                    "Failed to set session product schedule"));
        }
    }
}

public record SetupScheduleCommand(List<DayAvailability> DayAvailabilities , Guid ProfessionalId , string TimeZoneId ) : ICommand;

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