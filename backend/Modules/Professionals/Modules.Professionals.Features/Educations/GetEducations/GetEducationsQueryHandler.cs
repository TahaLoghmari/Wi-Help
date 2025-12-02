using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Educations.GetEducations;

public class GetEducationsQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetEducationsQueryHandler> logger) : IQueryHandler<GetEducationsQuery, List<EducationDto>>
{
    public async Task<Result<List<EducationDto>>> Handle(GetEducationsQuery query, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting educations for professional {ProfessionalId}", query.ProfessionalId);

        var educations = await dbContext.Educations
            .AsNoTracking()
            .Where(e => e.ProfessionalId == query.ProfessionalId)
            .OrderByDescending(e => e.StartYear)
            .Select(e => new EducationDto(
                e.Id,
                e.Institution,
                e.Degree,
                e.FieldOfStudy,
                e.Country,
                e.StartYear,
                e.EndYear,
                e.IsCurrentlyStudying,
                e.CreatedAt,
                e.UpdatedAt))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} educations for professional {ProfessionalId}", 
            educations.Count, query.ProfessionalId);

        return Result<List<EducationDto>>.Success(educations);
    }
}
