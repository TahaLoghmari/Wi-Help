using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Reviews.Domain.Abstractions;

namespace Modules.Reviews.Features.GetReviewsForAdmin;

internal sealed class GetReviewsForAdminHandler(
    IGetReviewsForAdminPort reviewsPort,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi)
    : IQueryHandler<GetReviewsForAdminQuery, PaginationResultDto<ReviewAdminDto>>
{
    public async Task<Result<PaginationResultDto<ReviewAdminDto>>> Handle(GetReviewsForAdminQuery query, CancellationToken cancellationToken)
    {
        var reviewsPage = await reviewsPort.GetAsync(query.Page, query.PageSize, cancellationToken);
        var reviews = reviewsPage.Reviews;
        var totalCount = reviewsPage.TotalCount;

        if (reviews.Count == 0)
        {
            return Result<PaginationResultDto<ReviewAdminDto>>.Success(new PaginationResultDto<ReviewAdminDto>
            {
                Items = [],
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount
            });
        }

        var patientIds = reviews.Select(r => r.PatientId).Distinct();
        var professionalIds = reviews.Select(r => r.ProfessionalId).Distinct();

        var patientsResult = await patientsModuleApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        var professionalsResult = await professionalModuleApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);

        var patients = patientsResult.IsSuccess ? patientsResult.Value : [];
        var professionals = professionalsResult.IsSuccess ? professionalsResult.Value : [];

        var reviewDtos = reviews.Select(r =>
        {
            var patient = patients.FirstOrDefault(p => p.Id == r.PatientId);
            var professional = professionals.FirstOrDefault(p => p.Id == r.ProfessionalId);

            return new ReviewAdminDto(
                r.Id,
                r.PatientId,
                patient != null ? $"{patient.FirstName} {patient.LastName}" : "Unknown",
                patient?.ProfilePictureUrl ?? "",
                r.ProfessionalId,
                professional != null ? $"{professional.FirstName} {professional.LastName}" : "Unknown",
                professional?.ProfilePictureUrl ?? "",
                r.Rating,
                r.Comment,
                r.CreatedAt
            );
        }).ToList();

        return Result<PaginationResultDto<ReviewAdminDto>>.Success(new PaginationResultDto<ReviewAdminDto>
        {
            Items = reviewDtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
