using System.Globalization;

namespace Modules.Professionals.Features.GetProfessionalAvailability;

public static class GetProfessionalAvailabilityUtility
{
    public static List<TimeSlotResponse> CalculateAvailabilitySlots(
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
    
}