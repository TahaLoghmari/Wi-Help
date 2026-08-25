using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Domain.Ports;

namespace Modules.Patients.Features.GetConditions;

public sealed class GetConditionsQueryHandler(
    IPatientCatalogOperations patientCatalog,
    ILogger<GetConditionsQueryHandler> logger) : IQueryHandler<GetConditionsQuery, List<ConditionDto>>
{
    public async Task<Result<List<ConditionDto>>> Handle(
        GetConditionsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all conditions");

        var conditions = (await patientCatalog.GetConditionsAsync(cancellationToken))
            .Select(condition => new ConditionDto(condition.Id, condition.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} conditions", conditions.Count);

        return Result<List<ConditionDto>>.Success(conditions);
    }
}
