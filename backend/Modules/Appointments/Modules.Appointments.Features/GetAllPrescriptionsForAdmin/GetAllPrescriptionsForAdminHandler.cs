using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetAllPrescriptionsForAdmin;

internal sealed class GetAllPrescriptionsForAdminHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsModuleApi,
    IProfessionalModuleApi professionalModuleApi)
    : IQueryHandler<GetAllPrescriptionsForAdminQuery, PaginationResultDto<PrescriptionAdminDto>>
{
    public async Task<Result<PaginationResultDto<PrescriptionAdminDto>>> Handle(GetAllPrescriptionsForAdminQuery query, CancellationToken cancellationToken)
    {
        var totalCount = await dbContext.Prescriptions.CountAsync(cancellationToken);

        var prescriptions = await dbContext.Prescriptions
            .OrderByDescending(p => p.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        if (prescriptions.Count == 0)
        {
            return Result<PaginationResultDto<PrescriptionAdminDto>>.Success(new PaginationResultDto<PrescriptionAdminDto>
            {
                Items = [],
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount
            });
        }

        var patientIds = prescriptions.Select(p => p.PatientId).Distinct();
        var professionalIds = prescriptions.Select(p => p.ProfessionalId).Distinct();

        var patientsResult = await patientsModuleApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        var professionalsResult = await professionalModuleApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);

        var patients = patientsResult.IsSuccess ? patientsResult.Value : [];
        var professionals = professionalsResult.IsSuccess ? professionalsResult.Value : [];

        var dtos = prescriptions.Select(p =>
        {
            var patient = patients.FirstOrDefault(pat => pat.Id == p.PatientId);
            var professional = professionals.FirstOrDefault(prof => prof.Id == p.ProfessionalId);

            return new PrescriptionAdminDto(
                p.Id,
                p.PatientId,
                patient != null ? $"{patient.FirstName} {patient.LastName}" : "Unknown",
                patient?.ProfilePictureUrl ?? "",
                p.ProfessionalId,
                professional != null ? $"{professional.FirstName} {professional.LastName}" : "Unknown",
                professional?.ProfilePictureUrl ?? "",
                p.Title ?? "No Title",
                p.CreatedAt,
                p.PdfUrl
            );
        }).ToList();

        return Result<PaginationResultDto<PrescriptionAdminDto>>.Success(new PaginationResultDto<PrescriptionAdminDto>
        {
            Items = dtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        });
    }
}
