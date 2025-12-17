namespace Modules.Reviews.Features.GetPatientReviewStats;

public sealed record GetPatientReviewStatsDto(
    double AverageRating,
    int TotalCount);
