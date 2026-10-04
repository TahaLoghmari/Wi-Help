using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Repositories;

namespace Modules.Professionals.Features.GetSpecializations;

public sealed class GetSpecializationsQueryHandler(
    IProfessionalCatalogRepository catalogRepository,
    ILogger<GetSpecializationsQueryHandler> logger) : IQueryHandler<GetSpecializationsQuery, List<SpecializationDto>>
{
    public async Task<Result<List<SpecializationDto>>> Handle(
        GetSpecializationsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all specializations");

        var specializations = (await catalogRepository.GetSpecializationsAsync(cancellationToken))
            .Select(s => new SpecializationDto(s.Id, s.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} specializations", specializations.Count);

        return Result<List<SpecializationDto>>.Success(specializations);
    }
}
