namespace Modules.Reviews.Features.GetReviewStats;

public sealed record ReviewStatsDto(
    double AverageRating,
    int TotalCount);
