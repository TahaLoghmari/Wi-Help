using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientProfessionals;

internal sealed class GetPatientProfessionalsQueryHandler(
    IAppointmentRead appointments,
    IProfessionalModuleApi professionalsApi)
    : IQueryHandler<GetPatientProfessionalsQuery, PaginationResultDto<ProfessionalDto>>
{
    public async Task<Result<PaginationResultDto<ProfessionalDto>>> Handle(GetPatientProfessionalsQuery query, CancellationToken cancellationToken)
    {
        var professionalsPage = await appointments.GetPatientProfessionalsPageAsync(
            query.PatientId,
            query.Page,
            query.PageSize,
            cancellationToken);

        if (professionalsPage.TotalCount == 0)
        {
            return Result<PaginationResultDto<ProfessionalDto>>.Success(new PaginationResultDto<ProfessionalDto>
            {
                Items = new List<ProfessionalDto>(),
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = 0
            });
        }

        // Get Professional Details
        var professionalsResult = await professionalsApi.GetProfessionalsByIdsAsync(professionalsPage.Items, cancellationToken);
        
        if (professionalsResult.IsFailure)
        {
            return Result<PaginationResultDto<ProfessionalDto>>.Failure(professionalsResult.Error);
        }

        return Result<PaginationResultDto<ProfessionalDto>>.Success(new PaginationResultDto<ProfessionalDto>
        {
            Items = professionalsResult.Value,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = professionalsPage.TotalCount
        });
    }
}
