using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.GetPatientReviewStats;

public sealed class GetPatientReviewStatsQueryHandler(
    ReviewsDbContext dbContext)
    : IQueryHandler<GetPatientReviewStatsQuery, GetPatientReviewStatsDto>
{
    public async Task<Result<GetPatientReviewStatsDto>> Handle(
        GetPatientReviewStatsQuery query,
        CancellationToken cancellationToken)
    {
        var reviews = await dbContext.Reviews
            .AsNoTracking()
            .Where(r => r.PatientId == query.PatientId && r.Type == ReviewType.PatientReview)
            .ToListAsync(cancellationToken);

        if (reviews.Count == 0)
        {
            return Result<GetPatientReviewStatsDto>.Success(new GetPatientReviewStatsDto(
                AverageRating: 0,
                TotalCount: 0));
        }

        var averageRating = reviews.Average(r => r.Rating);
        var totalCount = reviews.Count;

        return Result<GetPatientReviewStatsDto>.Success(new GetPatientReviewStatsDto(
            AverageRating: Math.Round(averageRating, 1),
            TotalCount: totalCount));
    }
}
