using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientProfessionals;

internal sealed class GetPatientProfessionalsQueryHandler(
    AppointmentsDbContext dbContext,
    IProfessionalModuleApi professionalsApi)
    : IQueryHandler<GetPatientProfessionalsQuery, PaginationResultDto<ProfessionalDto>>
{
    public async Task<Result<PaginationResultDto<ProfessionalDto>>> Handle(GetPatientProfessionalsQuery query, CancellationToken cancellationToken)
    {
        // Get total count of distinct professionals
        var totalCount = await dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.PatientId == query.PatientId)
            .Select(a => a.ProfessionalId)
            .Distinct()
            .CountAsync(cancellationToken);

        if (totalCount == 0)
        {
            return Result<PaginationResultDto<ProfessionalDto>>.Success(new PaginationResultDto<ProfessionalDto>
            {
                Items = new List<ProfessionalDto>(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = 0
            });
        }

        // Get paginated professional IDs
        var professionalIds = await dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.PatientId == query.PatientId)
            .Select(a => a.ProfessionalId)
            .Distinct()
            .OrderBy(id => id) // Order by ID for consistency
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        // Get Professional Details
        var professionalsResult = await professionalsApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        
        if (professionalsResult.IsFailure)
        {
            return Result<PaginationResultDto<ProfessionalDto>>.Failure(professionalsResult.Error);
        }

        return Result<PaginationResultDto<ProfessionalDto>>.Success(new PaginationResultDto<ProfessionalDto>
        {
            Items = professionalsResult.Value,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
