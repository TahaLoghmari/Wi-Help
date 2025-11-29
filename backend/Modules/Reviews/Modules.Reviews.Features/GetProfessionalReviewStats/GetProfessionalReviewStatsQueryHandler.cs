using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Reviews.Features.GetProfessionalReviewStats;

public sealed class GetProfessionalReviewStatsQueryHandler(
    ReviewsDbContext dbContext)
    : IQueryHandler<GetProfessionalReviewStatsQuery, GetProfessionalReviewStatsDto>
{
    public async Task<Result<GetProfessionalReviewStatsDto>> Handle(
        GetProfessionalReviewStatsQuery query,
        CancellationToken cancellationToken)
    {
        var reviews = await dbContext.Reviews
            .AsNoTracking()
            .Where(r => r.ProfessionalId == query.ProfessionalId)
            .ToListAsync(cancellationToken);

        if (reviews.Count == 0)
        {
            return Result<GetProfessionalReviewStatsDto>.Success(new GetProfessionalReviewStatsDto(
                AverageRating: 0,
                TotalCount: 0));
        }

        var averageRating = reviews.Average(r => r.Rating);
        var totalCount = reviews.Count;

        return Result<GetProfessionalReviewStatsDto>.Success(new GetProfessionalReviewStatsDto(
            AverageRating: Math.Round(averageRating, 1),
            TotalCount: totalCount));
    }
}

