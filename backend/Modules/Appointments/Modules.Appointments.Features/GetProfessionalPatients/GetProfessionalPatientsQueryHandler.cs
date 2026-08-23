using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

internal sealed class GetProfessionalPatientsQueryHandler(
    IGetProfessionalPatientsStore appointmentsStore,
    IPatientsModuleApi patientsApi)
    : IQueryHandler<GetProfessionalPatientsQuery, PaginationResultDto<PatientDto>>
{
    public async Task<Result<PaginationResultDto<PatientDto>>> Handle(GetProfessionalPatientsQuery query, CancellationToken cancellationToken)
    {

        var patientsPage = await appointmentsStore.GetAsync(
            query.ProfessionalId,
            query.Page,
            query.PageSize,
            cancellationToken);

        if (patientsPage.TotalCount == 0)
        {
            return Result<PaginationResultDto<PatientDto>>.Success(new PaginationResultDto<PatientDto>
            {
                Items = new List<PatientDto>(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = 0
            });
        }

        // Get Patient Details
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientsPage.Items, cancellationToken);
        
        if (patientsResult.IsFailure)
        {
            return Result<PaginationResultDto<PatientDto>>.Failure(patientsResult.Error);
        }

        return Result<PaginationResultDto<PatientDto>>.Success(new PaginationResultDto<PatientDto>
        {
            Items = patientsResult.Value,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = patientsPage.TotalCount
        });
    }
}
