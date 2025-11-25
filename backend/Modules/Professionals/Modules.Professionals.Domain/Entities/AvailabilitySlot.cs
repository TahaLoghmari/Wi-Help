using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; private set; }
    public Guid AvailabilityDayId { get; private set; } 
    public TimeRange TimeRange { get; private set; } = null!;
    public AvailabilityDay Day { get; private set; } = null!;

    protected AvailabilitySlot() {}
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