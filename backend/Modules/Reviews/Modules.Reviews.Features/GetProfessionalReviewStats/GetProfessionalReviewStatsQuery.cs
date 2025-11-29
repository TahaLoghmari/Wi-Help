using Modules.Common.Features.Abstractions;
using Modules.Reviews.Features.GetProfessionalReviewStats;

namespace Modules.Reviews.Features.GetProfessionalReviewStats;

public sealed record GetProfessionalReviewStatsQuery(Guid ProfessionalId) 
    : IQuery<GetProfessionalReviewStatsDto>;

