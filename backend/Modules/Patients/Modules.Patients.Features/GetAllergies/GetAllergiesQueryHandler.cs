using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetAllergies;

public sealed class GetAllergiesQueryHandler(
    PatientsDbContext dbContext,
    ILogger<GetAllergiesQueryHandler> logger) : IQueryHandler<GetAllergiesQuery, List<AllergyDto>>
{
    public async Task<Result<List<AllergyDto>>> Handle(
        GetAllergiesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all allergies");

        var allergies = await dbContext.Allergies
            .AsNoTracking()
            .OrderBy(a => a.Key)
            .Select(a => new AllergyDto(a.Id, a.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} allergies", allergies.Count);

        return Result<List<AllergyDto>>.Success(allergies);
    }
}
