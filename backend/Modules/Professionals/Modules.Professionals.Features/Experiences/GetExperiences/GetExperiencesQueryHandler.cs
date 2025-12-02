using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.Experiences.GetExperiences;

public class GetExperiencesQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetExperiencesQueryHandler> logger) : IQueryHandler<GetExperiencesQuery, List<ExperienceDto>>
{
    public async Task<Result<List<ExperienceDto>>> Handle(GetExperiencesQuery query, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting experiences for professional {ProfessionalId}", query.ProfessionalId);

        var experiences = await dbContext.WorkExperiences
            .AsNoTracking()
            .Where(e => e.ProfessionalId == query.ProfessionalId)
            .OrderByDescending(e => e.IsCurrentPosition)
            .ThenByDescending(e => e.StartYear)
            .Select(e => new ExperienceDto(
                e.Id,
                e.Title,
                e.Organization,
                e.Location,
                e.Description,
                e.StartYear,
                e.EndYear,
                e.IsCurrentPosition,
                e.CreatedAt,
                e.UpdatedAt))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Found {Count} experiences for professional {ProfessionalId}", 
            experiences.Count, query.ProfessionalId);

        return Result<List<ExperienceDto>>.Success(experiences);
    }
}
