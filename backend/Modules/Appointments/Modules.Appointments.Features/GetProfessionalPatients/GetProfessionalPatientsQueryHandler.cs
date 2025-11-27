using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

internal sealed class GetProfessionalPatientsQueryHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetProfessionalPatientsQuery, PaginationResultDto<PatientDto>>
{
    public async Task<Result<PaginationResultDto<PatientDto>>> Handle(GetProfessionalPatientsQuery query, CancellationToken cancellationToken)
    {

        // Get total count of distinct patients
        var totalCount = await dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.ProfessionalId == query.ProfessionalId)
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync(cancellationToken);

        if (totalCount == 0)
        {
            return Result<PaginationResultDto<PatientDto>>.Success(new PaginationResultDto<PatientDto>
            {
                Items = new List<PatientDto>(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = 0
            });
        }

        // Get paginated patient IDs
        var patientIds = await dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.ProfessionalId == query.ProfessionalId)
            .Select(a => a.PatientId)
            .Distinct()
            .OrderBy(id => id) // Order by ID for consistency
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Get Patient Details
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        
        if (patientsResult.IsFailure)
        {
            return Result<PaginationResultDto<PatientDto>>.Failure(patientsResult.Error);
        }

        return Result<PaginationResultDto<PatientDto>>.Success(new PaginationResultDto<PatientDto>
        {
            Items = patientsResult.Value,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
