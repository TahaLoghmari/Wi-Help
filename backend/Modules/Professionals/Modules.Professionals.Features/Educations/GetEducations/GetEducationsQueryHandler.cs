using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.Educations.GetEducations;

public class GetEducationsQueryHandler(
    IProfessionalQualificationsRepository repository,
    ILogger<GetEducationsQueryHandler> logger) : IQueryHandler<GetEducationsQuery, List<EducationDto>>
{
    public async Task<Result<List<EducationDto>>> Handle(GetEducationsQuery query, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting educations for professional {ProfessionalId}", query.ProfessionalId);

        var educations = (await repository.GetEducationsAsync(query.ProfessionalId, cancellationToken))
            .Select(e => new EducationDto(
                e.Id,
                e.Institution,
                e.Degree,
                e.FieldOfStudy,
                e.CountryId,
                e.Description,
                e.StartYear,
                e.EndYear,
                e.IsCurrentlyStudying,
                e.CreatedAt,
                e.UpdatedAt))
            .ToList();

        logger.LogInformation("Found {Count} educations for professional {ProfessionalId}", 
            educations.Count, query.ProfessionalId);

        return Result<List<EducationDto>>.Success(educations);
    }
}
