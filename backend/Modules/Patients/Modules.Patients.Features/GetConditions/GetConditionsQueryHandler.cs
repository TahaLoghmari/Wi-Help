using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetConditions;

public sealed class GetConditionsQueryHandler(
    PatientsDbContext dbContext,
    ILogger<GetConditionsQueryHandler> logger) : IQueryHandler<GetConditionsQuery, List<ConditionDto>>
{
    public async Task<Result<List<ConditionDto>>> Handle(
        GetConditionsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all conditions");

        var conditions = await dbContext.Conditions
            .AsNoTracking()
            .OrderBy(c => c.Key)
            .Select(c => new ConditionDto(c.Id, c.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} conditions", conditions.Count);

        return Result<List<ConditionDto>>.Success(conditions);
    }
}
