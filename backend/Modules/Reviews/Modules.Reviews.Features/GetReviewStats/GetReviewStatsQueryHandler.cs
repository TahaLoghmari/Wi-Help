using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Reviews.Domain;
using Modules.Reviews.Domain.Abstractions;

namespace Modules.Reviews.Features.GetReviewStats;

internal sealed class GetReviewStatsQueryHandler(
    IGetReviewStatsPort reviewsPort)
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

        var stats = await reviewsPort.GetAsync(subjectId, cancellationToken);

        return Result<ReviewStatsDto>.Success(
            new ReviewStatsDto(Math.Round(stats.Average, 1), stats.Count));
    }
}
