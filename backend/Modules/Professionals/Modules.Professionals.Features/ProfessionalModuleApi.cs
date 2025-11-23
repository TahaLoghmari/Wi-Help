using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.Features;

public class ProfessionalModuleApi(ProfessionalsDbContext professionalsDbContext, ILogger<ProfessionalModuleApi> logger)
    : IProfessionalModuleApi
{
    public async Task<MonthlyAvailabilityResponse> GetMonthlyAvailability(GetProfessionalAvailabilityByMonthQuery query)
    {
        try
        {
            var availabilityDays = await professionalsDbContext.AvailabilityDays
                .Include(ad => ad.AvailabilitySlots)
                .Where(ad => ad.ProfessionalId == query.ProfessionalId)
                .ToListAsync();

            var allDaysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(query.Year, query.Month))
                .Select(day => new DateOnly(query.Year, query.Month, day))
                .ToList();

            // Filter out past days if IncludePastDays is false
            var daysToProcess = query.IncludePastDays
                ? allDaysInMonth
                : allDaysInMonth.Where(date => date >= DateOnly.FromDateTime(DateTime.UtcNow)).ToList();

            var monthlyAvailability = new List<DailyAvailabilityResponse>();
            TimeSlotResponse? latestSlot = null;

            foreach (var date in daysToProcess)
            {
                var dayAvailabilities = availabilityDays
                    .Where(ad => ad.DayOfWeek == date.DayOfWeek)
                    .ToList();

                if (!dayAvailabilities.Any())
                {
                    // No availability configured for this day of week
                    monthlyAvailability.Add(new DailyAvailabilityResponse(
                        date,
                        false,
                        new List<TimeSlotResponse>(),
                        new DailySummary(0, 0, 0, 0)));
                    continue;
                }

                var allDaySlots = new List<TimeSlotResponse>();
                var isToday = DateTime.Today.Date == date.ToDateTime(TimeOnly.MinValue).Date;

                // Process each availability window for this day
                foreach (var dayAvailability in dayAvailabilities)
                {
                    foreach (var availabilitySlot in dayAvailability.AvailabilitySlots)
                    {
                        var slots = CalculateAvailabilitySlots(
                            latestSlot,
                            DateTime.UtcNow,
                            isToday,
                            availabilitySlot.TimeRange.StartTime,
                            availabilitySlot.TimeRange.EndTime,
                            [], // Empty booked sessions for now : TODO : get it from appointments module 
                            15);

                        allDaySlots.AddRange(slots);

                        // Update latestSlot to track continuity across availability windows
                        if (slots.Any())
                        {
                            latestSlot = slots.Last();
                        }
                    }
                }

                // Calculate summary for the entire day
                var totalSlots = allDaySlots.Count;
                var bookedSlots = allDaySlots.Count(slot => slot.IsBooked);
                var availableSlots = totalSlots - bookedSlots;
                var availabilityPercentage = totalSlots > 0 ? (decimal)availableSlots / totalSlots * 100 : 0;

                monthlyAvailability.Add(new DailyAvailabilityResponse(
                    date,
                    availableSlots > 0,
                    allDaySlots,
                    new DailySummary(totalSlots, availableSlots, bookedSlots, availabilityPercentage)));

                // Reset latestSlot for next day
                latestSlot = null;
            }

            var response = new MonthlyAvailabilityResponse(
                query.Year,
                query.Month,
                monthlyAvailability);

            logger.LogInformation(
                "Retrieved availability for {DayCount} days in {Year}/{Month} for professional {ProfessionalId}",
                monthlyAvailability.Count,
                query.Year,
                query.Month,
                query.ProfessionalId);

            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to get monthly availability for professional {ProfessionalId}",
                query.ProfessionalId);
            throw;
        }
    }

    /// <summary>
    /// Calculates availability slots within a time range, considering booked sessions and buffer times.
    /// </summary>
    /// <param name="latestSlot">The last slot from previous availability window (for continuity)</param>
    /// <param name="currentTimeUtc">Current UTC time to filter out past slots</param>
    /// <param name="considerTime">Whether to filter out slots that are in the past (for today)</param>
    /// <param name="startTime">Start time of the availability window</param>
    /// <param name="endTime">End time of the availability window</param>
    /// <param name="bookedSessions">List of already booked sessions</param>
    /// <param name="bufferTimeMinutes">Buffer time between slots in minutes</param>
    /// <returns>List of time slot responses</returns>
    private List<TimeSlotResponse> CalculateAvailabilitySlots(
        TimeSlotResponse? latestSlot,
        DateTime currentTimeUtc,
        bool considerTime,
        TimeOnly startTime,
        TimeOnly endTime,
        List<ScheduledAtWithDuration> bookedSessions,
        int bufferTimeMinutes)
    {
        var slots = new List<TimeSlotResponse>();
        var currentTime = startTime;

        // Handle gap between availability windows to ensure proper buffer time
        if (latestSlot?.EndTime != null)
        {
            var latestEndTime = TimeOnly.Parse(latestSlot.EndTime);
            var minimumStartTime = latestEndTime.Add(TimeSpan.FromMinutes(bufferTimeMinutes));
            if (currentTime < minimumStartTime)
            {
                currentTime = minimumStartTime;
            }
        }

        while (currentTime <= endTime)
        {
            var slotEndTime = currentTime.Add(TimeSpan.FromMinutes(30));
            if (slotEndTime > endTime) break;

            var isBooked = bookedSessions.Any(session =>
            {
                var sessionStart = session.ScheduledAt.TimeOfDay;
                var sessionEnd = sessionStart.Add(TimeSpan.FromMinutes(session.Minutes));
                var slotStart = currentTime.ToTimeSpan();
                var slotEnd = slotEndTime.ToTimeSpan();

                // Check if there's any overlap between the slot and the session
                return slotStart < sessionEnd && slotEnd > sessionStart;
            });

            var isAvailable = !isBooked;

            // Filter out past time slots for today
            if (considerTime && currentTime < TimeOnly.FromDateTime(currentTimeUtc))
            {
                isAvailable = false;
            }

            slots.Add(new TimeSlotResponse(
                currentTime.ToString("HH:mm", CultureInfo.InvariantCulture),
                slotEndTime.ToString("HH:mm", CultureInfo.InvariantCulture),
                isBooked,
                isAvailable));

            currentTime = slotEndTime.AddMinutes(bufferTimeMinutes);
        }

        return slots;
    }

    /// <summary>
    /// Represents a scheduled session with its start time and duration.
    /// </summary>
    public record ScheduledAtWithDuration(DateTime ScheduledAt, int Minutes);
}