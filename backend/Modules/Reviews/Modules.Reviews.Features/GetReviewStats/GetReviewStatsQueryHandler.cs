using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Features.GetReviewStats;

internal sealed class GetReviewStatsQueryHandler(
    ReviewsDbContext dbContext)
    : IQueryHandler<GetReviewStatsQuery, ReviewStatsDto>
{
    public async Task<Result<ReviewStatsDto>> Handle(
        GetReviewStatsQuery query,
        CancellationToken cancellationToken)
    {
        // Determine the subject ID: explicit param or default to current user
        Guid subjectId;

        if (query.SubjectId.HasValue)
        {
            subjectId = query.SubjectId.Value;
        }
        else if (query.CallerProfessionalId.HasValue)
        {
            subjectId = query.CallerProfessionalId.Value;
        }
        else if (query.CallerPatientId.HasValue)
        {
            subjectId = query.CallerPatientId.Value;
        }
        else
        {
            return Result<ReviewStatsDto>.Failure(ReviewErrors.Unauthorized());
        }

        // Query reviews where subjectId is the subject (could be professional or patient)
        var stats = await dbContext.Reviews
            .AsNoTracking()
            .Where(r =>
                (r.ProfessionalId == subjectId && r.Type == ReviewType.ProfessionalReview)
                || (r.PatientId == subjectId && r.Type == ReviewType.PatientReview))
            .GroupBy(_ => 1)
            .Select(g => new { Average = g.Average(r => (double)r.Rating), Count = g.Count() })
            .FirstOrDefaultAsync(cancellationToken);

        if (stats is null)
            return Result<ReviewStatsDto>.Success(new ReviewStatsDto(0, 0));

        return Result<ReviewStatsDto>.Success(
            new ReviewStatsDto(Math.Round(stats.Average, 1), stats.Count));
    }
}
