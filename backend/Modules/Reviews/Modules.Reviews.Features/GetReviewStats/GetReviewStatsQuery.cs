using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.GetReviewStats;

public sealed record GetReviewStatsQuery(
    Guid? SubjectId,
    Guid? CallerPatientId,
    Guid? CallerProfessionalId) : IQuery<ReviewStatsDto>;
