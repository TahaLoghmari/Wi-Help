using Modules.Common.Features.Results;
namespace Modules.Common.Features.ValueObjects;

public record TimeRange 
{
    private TimeRange()
    {
    }

    public TimeRange(
        TimeOnly startTime,
        TimeOnly endTime)
    {
        StartTime = startTime;
        EndTime = endTime;
    }

    public TimeOnly StartTime { set; get; }
    public TimeOnly EndTime { set; get; }

    public Result Update(
        TimeOnly startTime,
        TimeOnly endTime)
    {
        if (startTime >= endTime)
            return Result.Failure(TimeRangeErrors.StartHourMustBeBeforeEndHour);
        
        StartTime = startTime;
        EndTime = endTime;

        return Result.Success();
    }
    
    public bool OverlapsWith(TimeRange other)
    {
        var startTotal = StartTime.Hour * 60 + StartTime.Minute;
        var endTotal = EndTime.Hour * 60 + EndTime.Minute;

        var otherStartTotal = other.StartTime.Hour * 60 + other.StartTime.Minute;
        var otherEndTotal = other.EndTime.Hour * 60 + other.EndTime.Minute;

        return startTotal < otherEndTotal && endTotal > otherStartTotal;
    }
    
}