namespace Modules.Professionals.Features.GetProfessionalAvailability;

public sealed record MonthlyAvailabilityResponse(
    int Year,
    int Month,
    List<DailyAvailabilityResponse> Days);
    
public sealed record DailyAvailabilityResponse(
    DateOnly Date,
    bool IsAvailable,
    List<TimeSlotResponse> TimeSlots,
    DailySummary Summary);

public sealed record DailySummary(
    int TotalSlots,
    int AvailableSlots,
    int BookedSlots,
    decimal AvailabilityPercentage);
    
public sealed record TimeSlotResponse(
    string StartTime,
    string EndTime,
    bool IsBooked,
    bool IsAvailable);
    
public record ScheduledAtWithDuration(DateTime ScheduledAt, int Minutes);