using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; set; }
    public Guid AvailabilityDayId { get; private set; } // foreign key to Day

    public TimeRange TimeRange { get; private set; } = null!;

    // Navigation property
    public AvailabilityDay Day { get; private set; } = null!;

    protected AvailabilitySlot()
    {
        // for ef core 
    }
    public AvailabilitySlot(Guid availabilityDayId, TimeRange range)
    {
        Id = Guid.NewGuid();
        AvailabilityDayId = availabilityDayId;
        TimeRange = range;
    }

    public static AvailabilitySlot Create(Guid availabilityDayId, TimeOnly startTime, TimeOnly endTime)
    {
        var timeRange = new TimeRange(startTime, endTime);
        return new AvailabilitySlot(availabilityDayId, timeRange);
    }
}