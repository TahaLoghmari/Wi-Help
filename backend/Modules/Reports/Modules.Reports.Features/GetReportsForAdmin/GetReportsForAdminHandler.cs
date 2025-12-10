using Microsoft.EntityFrameworkCore;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Reports.Infrastructure.Database;

namespace Modules.Reports.Features.GetReportsForAdmin;

internal sealed class GetReportsForAdminHandler(
    ReportsDbContext dbContext,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi)
    : IQueryHandler<GetReportsForAdminQuery, PaginationResultDto<ReportAdminDto>>
{
    public async Task<Result<PaginationResultDto<ReportAdminDto>>> Handle(GetReportsForAdminQuery query, CancellationToken cancellationToken)
    {
        var queryable = dbContext.Reports.AsQueryable();

        if (query.Type.HasValue)
        {
            queryable = queryable.Where(r => r.Type == query.Type.Value);
        }

        var totalCount = await queryable.CountAsync(cancellationToken);

        var reports = await queryable
            .OrderByDescending(r => r.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        if (reports.Count == 0)
        {
            return Result<PaginationResultDto<ReportAdminDto>>.Success(new PaginationResultDto<ReportAdminDto>
            {
                Items = [],
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount
            });
        }

        var reporterIds = reports.Select(r => r.ReporterId).Distinct();
        var reportedIds = reports.Select(r => r.ReportedId).Distinct();
        var allUserIds = reporterIds.Concat(reportedIds).Distinct().ToList();

        var patientsResult = await patientsModuleApi.GetPatientsByIdsAsync(allUserIds, cancellationToken);
        var professionalsResult = await professionalModuleApi.GetProfessionalsByIdsAsync(allUserIds, cancellationToken);

        var patients = patientsResult.IsSuccess ? patientsResult.Value : [];
        var professionals = professionalsResult.IsSuccess ? professionalsResult.Value : [];

        var dtos = reports.Select(r =>
        {
            // Try to find reporter in patients or professionals
            var reporterPatient = patients.FirstOrDefault(p => p.Id == r.ReporterId);
            var reporterProfessional = professionals.FirstOrDefault(p => p.Id == r.ReporterId);

            string reporterName = "Unknown";
            string reporterEmail = "";
            string reporterPhone = "";
            string reporterPic = "";

            if (reporterPatient != null)
            {
                reporterName = $"{reporterPatient.FirstName} {reporterPatient.LastName}";
                reporterEmail = reporterPatient.Email;
                reporterPhone = reporterPatient.PhoneNumber;
                reporterPic = reporterPatient.ProfilePictureUrl ?? "";
            }
            else if (reporterProfessional != null)
            {
                reporterName = $"{reporterProfessional.FirstName} {reporterProfessional.LastName}";
                reporterEmail = reporterProfessional.Email;
                reporterPhone = reporterProfessional.PhoneNumber;
                reporterPic = reporterProfessional.ProfilePictureUrl ?? "";
            }

            // Try to find reported user in patients or professionals
            var reportedPatient = patients.FirstOrDefault(p => p.Id == r.ReportedId);
            var reportedProfessional = professionals.FirstOrDefault(p => p.Id == r.ReportedId);

            string reportedName = "Unknown";
            string reportedEmail = "";
            string reportedPhone = "";
            string reportedPic = "";

            if (reportedPatient != null)
            {
                reportedName = $"{reportedPatient.FirstName} {reportedPatient.LastName}";
                reportedEmail = reportedPatient.Email;
                reportedPhone = reportedPatient.PhoneNumber;
                reportedPic = reportedPatient.ProfilePictureUrl ?? "";
            }
            else if (reportedProfessional != null)
            {
                reportedName = $"{reportedProfessional.FirstName} {reportedProfessional.LastName}";
                reportedEmail = reportedProfessional.Email;
                reportedPhone = reportedProfessional.PhoneNumber;
                reportedPic = reportedProfessional.ProfilePictureUrl ?? "";
            }

            return new ReportAdminDto(
                r.Id,
                r.ReporterId,
                reporterName,
                reporterEmail,
                reporterPhone,
                reporterPic,
                r.ReportedId,
                reportedName,
                reportedEmail,
                reportedPhone,
                reportedPic,
                r.Title,
                r.Description,
                r.CreatedAt,
                r.Status.ToString()
            );
        }).ToList();

        return Result<PaginationResultDto<ReportAdminDto>>.Success(new PaginationResultDto<ReportAdminDto>
        {
            Items = dtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
