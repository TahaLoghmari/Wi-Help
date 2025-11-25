using Modules.Common.Features.Results;

namespace Modules.Common.Features;

public static class TimeRangeErrors
{
    public static readonly Error InvalidStartHour = Error.Problem(
        "TimeRange.InvalidStartHour",
        "Start hour must be between 0 and 23");

    public static readonly Error InvalidEndHour = Error.Problem(
        "TimeRange.InvalidEndHour",
        "End hour must be between 0 and 23");

    public static readonly Error InvalidStartMinute =
        Error.Problem("TimeRange.InvalidStartMinute", "Start minute must be between 0 and 59");

    public static readonly Error InvalidEndMinute =
        Error.Problem("TimeRange.InvalidEndMinute", "End minute must be between 0 and 59");


    public static readonly Error StartHourMustBeBeforeEndHour = Error.Problem(
        "TimeRange.StartHourMustBeBeforeEndHour",
        "Start hour must be before end hour");
}