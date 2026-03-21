using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Features.GetSpecializations;

public sealed class GetSpecializationsQueryHandler(
    ProfessionalsDbContext dbContext,
    ILogger<GetSpecializationsQueryHandler> logger) : IQueryHandler<GetSpecializationsQuery, List<SpecializationDto>>
{
    public async Task<Result<List<SpecializationDto>>> Handle(
        GetSpecializationsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all specializations");

        var specializations = await dbContext.Specializations
            .AsNoTracking()
            .OrderBy(s => s.Key)
            .Select(s => new SpecializationDto(s.Id, s.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} specializations", specializations.Count);

        return Result<List<SpecializationDto>>.Success(specializations);
    }
}
