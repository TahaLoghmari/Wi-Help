using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetProfessionalPatients;

internal sealed class GetProfessionalPatientsQueryHandler(
    AppointmentsDbContext dbContext,
    IProfessionalModuleApi professionalApi,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetProfessionalPatientsQuery, List<PatientDto>>
{
    public async Task<Result<List<PatientDto>>> Handle(GetProfessionalPatientsQuery query, CancellationToken cancellationToken)
    {
        // 1. Get Professional ID
        var professionalResult = await professionalApi.GetProfessionalByUserIdAsync(query.UserId, cancellationToken);
        if (professionalResult.IsFailure)
        {
            return Result<List<PatientDto>>.Failure(professionalResult.Error);
        }

        var professionalId = professionalResult.Value.Id;

        // 2. Get Patient IDs from Appointments
        var patientIds = await dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.ProfessionalId == professionalId)
            .Select(a => a.PatientId)
            .Distinct()
            .ToListAsync(cancellationToken);

        if (patientIds.Count == 0)
        {
            return Result<List<PatientDto>>.Success(new List<PatientDto>());
        }

        // 3. Get Patient Details
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        
        return patientsResult;
    }
}
