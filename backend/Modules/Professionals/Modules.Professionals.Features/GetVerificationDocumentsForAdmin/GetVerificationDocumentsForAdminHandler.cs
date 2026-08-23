using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Professionals.Domain.Ports;
using Modules.Professionals.PublicApi;

namespace Modules.Professionals.Features.GetVerificationDocumentsForAdmin;

internal sealed class GetVerificationDocumentsForAdminHandler(
    IProfessionalProfileOperations profileOperations,
    IProfessionalModuleApi professionalModuleApi)
    : IQueryHandler<GetVerificationDocumentsForAdminQuery, PaginationResultDto<ProfessionalVerificationDto>>
{
    public async Task<Result<PaginationResultDto<ProfessionalVerificationDto>>> Handle(GetVerificationDocumentsForAdminQuery query, CancellationToken cancellationToken)
    {
        var totalCount = await profileOperations.CountAsync(cancellationToken);

        var professionals = await profileOperations.GetVerificationPageAsync(query.Page, query.PageSize, cancellationToken);

        var professionalIds = professionals.Select(p => p.Id).ToList();
        var professionalDtosResult = await professionalModuleApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        var professionalDtos = professionalDtosResult.IsSuccess ? professionalDtosResult.Value : [];

        var dtos = professionals.Select(p =>
        {
            var profDto = professionalDtos.FirstOrDefault(pd => pd.Id == p.Id);
            
            return new ProfessionalVerificationDto(
                p.Id,
                profDto != null ? $"{profDto.FirstName} {profDto.LastName}" : "Unknown",
                profDto?.ProfilePictureUrl ?? "",
                p.VerificationStatus.ToString(),
                p.VerificationDocuments.Select(d => new VerificationDocumentAdminDto(
                    d.Id,
                    d.Type.ToString(),
                    d.DocumentUrl,
                    d.Status.ToString()
                )).ToList()
            );
        }).ToList();

        return Result<PaginationResultDto<ProfessionalVerificationDto>>.Success(new PaginationResultDto<ProfessionalVerificationDto>
        {
            Items = dtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
