using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Domain.Repositories;

namespace Modules.Patients.Features.GetMedications;

public sealed class GetMedicationsQueryHandler(
    IPatientCatalogRepository catalogRepository,
    ILogger<GetMedicationsQueryHandler> logger) : IQueryHandler<GetMedicationsQuery, List<MedicationDto>>
{
    public async Task<Result<List<MedicationDto>>> Handle(
        GetMedicationsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all medications");

        var medications = (await catalogRepository.GetMedicationsAsync(cancellationToken))
            .Select(medication => new MedicationDto(medication.Id, medication.Key))
            .ToList();

        logger.LogInformation("Retrieved {Count} medications", medications.Count);

        return Result<List<MedicationDto>>.Success(medications);
    }
}
