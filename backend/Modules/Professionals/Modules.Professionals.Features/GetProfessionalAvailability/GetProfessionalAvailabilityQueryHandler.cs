using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Professionals.Features.GetProfessionalAvailability;

internal sealed class GetProfessionalAvailabilityQueryHandler(
    ProfessionalsDbContext professionalsDbContext,
    ILogger<GetProfessionalAvailabilityQueryHandler> logger)
    : IQueryHandler<GetProfessionalAvailabilityQuery, MonthlyAvailabilityResponse>
{
    public async Task<Result<MonthlyAvailabilityResponse>> Handle(
        GetProfessionalAvailabilityQuery query,
        CancellationToken cancellationToken)
    {
        // Retrieve all availability days for the professional, including their slots
        var availabilityDays = await professionalsDbContext.AvailabilityDays
            .Include(ad => ad.AvailabilitySlots)
            .Where(ad => ad.ProfessionalId == query.ProfessionalId)
            .ToListAsync();

        // Generate a list of all dates in the requested month
        var allDaysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(query.Year, query.Month))
            .Select(day => new DateOnly(query.Year, query.Month, day))
            .ToList();

        var monthlyAvailability = new List<DailyAvailabilityResponse>();
        TimeSlotResponse? latestSlot = null; // Tracks the last slot from previous availability windows for buffer continuity

        foreach (var date in allDaysInMonth)
        {
            // Find availability configurations that match this day's day of the week
            var dayAvailabilities = availabilityDays
                .Where(ad => ad.DayOfWeek == date.DayOfWeek)
                .ToList();

            if (!dayAvailabilities.Any())
            {
                // No availability configured for this day of week, so mark as unavailable
                monthlyAvailability.Add(new DailyAvailabilityResponse(
                    date,
                    false, // Not available
                    new List<TimeSlotResponse>(),
                    new DailySummary(0, 0, 0, 0))); // No slots
                continue;
            }

            var allDaySlots = new List<TimeSlotResponse>();
            var isToday = DateTime.Today.Date == date.ToDateTime(TimeOnly.MinValue).Date; // Check if processing today's date

            // Process each availability window configured for this day of the week
            foreach (var dayAvailability in dayAvailabilities)
            {
                foreach (var availabilitySlot in dayAvailability.AvailabilitySlots)
                {
                    // Calculate individual time slots within this availability window
                    var slots = GetProfessionalAvailabilityUtility.CalculateAvailabilitySlots(
                        latestSlot, // For handling buffer between windows
                        DateTime.UtcNow, // Current time for filtering past slots
                        isToday, // Only filter past times if it's today
                        availabilitySlot.TimeRange.StartTime,
                        availabilitySlot.TimeRange.EndTime,
                        [], // Empty booked sessions for now : TODO : get it from appointments module 
                        15); // 15-minute buffer between slots

                    allDaySlots.AddRange(slots);

                    // Update latestSlot to the last slot in this window for continuity in next window
                    if (slots.Any())
                    {
                        latestSlot = slots.Last();
                    }
                }
            }

            // Calculate summary statistics for the entire day
            var totalSlots = allDaySlots.Count;
            var bookedSlots = allDaySlots.Count(slot => slot.IsBooked);
            var availableSlots = totalSlots - bookedSlots;
            var availabilityPercentage = totalSlots > 0 ? (decimal)availableSlots / totalSlots * 100 : 0;

            // Add the day's availability to the monthly list
            monthlyAvailability.Add(new DailyAvailabilityResponse(
                date,
                availableSlots > 0, // Available if there are any free slots
                allDaySlots,
                new DailySummary(totalSlots, availableSlots, bookedSlots, availabilityPercentage)));

            // Reset latestSlot for the next day to avoid carry-over
            latestSlot = null;
        }

        // Create the final response object
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

        return Result<MonthlyAvailabilityResponse>.Success(response);
    }
}