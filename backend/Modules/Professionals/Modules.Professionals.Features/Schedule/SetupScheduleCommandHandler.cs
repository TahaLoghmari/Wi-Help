using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Schedule;

public record SetupScheduleCommand(List<DayAvailability> DayAvailabilities, Guid ProfessionalId, string TimeZoneId)
    : ICommand;

public class SetupScheduleCommandHandler(
    ProfessionalsDbContext professionalsDbContext,
    ILogger<SetupScheduleCommand> logger) : ICommandHandler<SetupScheduleCommand>
{
    public async Task<Result> Handle(SetupScheduleCommand command, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Setting schedule for professional {ProfessionalId}", command.ProfessionalId);

            var exisitingDayAvailabilities = await professionalsDbContext.AvailabilityDays
                .Include(ad => ad.AvailabilitySlots)
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

            await professionalsDbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Successfully set schedule for professional {ProfessionalId}",
                command.ProfessionalId);
            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to set schedule for professional {ProfessionalId}",
                command.ProfessionalId);
            return Result.Failure(
                Error.Problem(
                    "Professional.ScheduleSetFailed",
                    "Failed to set professional schedule"));
        }
    }
}