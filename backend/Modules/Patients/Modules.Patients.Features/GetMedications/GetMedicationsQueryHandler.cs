using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Features.GetMedications;

public sealed class GetMedicationsQueryHandler(
    PatientsDbContext dbContext,
    ILogger<GetMedicationsQueryHandler> logger) : IQueryHandler<GetMedicationsQuery, List<MedicationDto>>
{
    public async Task<Result<List<MedicationDto>>> Handle(
        GetMedicationsQuery query,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all medications");

        var medications = await dbContext.Medications
            .AsNoTracking()
            .OrderBy(m => m.Key)
            .Select(m => new MedicationDto(m.Id, m.Key))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} medications", medications.Count);

        return Result<List<MedicationDto>>.Success(medications);
    }
}
