using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Domain.Ports;

namespace Modules.Patients.Features.GetAllergies;

public sealed class GetAllergiesQueryHandler(
    IGetAllergiesPort allergiesPort,
    ILogger<GetAllergiesQueryHandler> logger) : IQueryHandler<GetAllergiesQuery, List<AllergyDto>>
{
    public async Task<Result<List<AllergyDto>>> Handle(
        GetAllergiesQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all allergies");

        var allergies = (await allergiesPort.GetAllAsync(cancellationToken))
            .Select(allergy => new AllergyDto(allergy.Id, allergy.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} allergies", allergies.Count);

        return Result<List<AllergyDto>>.Success(allergies);
    }
}
