using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.GetPatientReviewStats;

public sealed record GetPatientReviewStatsQuery(Guid PatientId)
    : IQuery<GetPatientReviewStatsDto>;
