using Modules.Appointments.Domain.Repositories;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetPatientPrescriptions;

public sealed class GetPatientPrescriptionsQueryHandler(
    IAppointmentRepository appointments,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetPatientPrescriptionsQuery, PaginationResultDto<PrescriptionDto>>
{
    public async Task<Result<PaginationResultDto<PrescriptionDto>>> Handle(
        GetPatientPrescriptionsQuery query,
        CancellationToken cancellationToken)
    {
        // Get patientId from userId
        var patientResult = await patientsApi.GetPatientByUserIdAsync(query.UserId, cancellationToken);
        if (patientResult.IsFailure)
        {
            return Result<PaginationResultDto<PrescriptionDto>>.Failure(patientResult.Error);
        }

        var patientId = patientResult.Value.Id;

        var paginatedPrescriptions = await appointments.GetPatientPrescriptionsPageAsync(
            patientId,
            query.Page,
            query.PageSize,
            cancellationToken);

        // Get professional info for prescriptions
        var professionalIds = paginatedPrescriptions.Items.Select(p => p.ProfessionalId).Distinct().ToList();
        var professionalsResult = await professionalApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);

        var professionalsMap = professionalsResult.IsSuccess 
            ? professionalsResult.Value.ToDictionary(p => p.Id)
            : new Dictionary<Guid, Modules.Professionals.PublicApi.Contracts.ProfessionalDto>();

        var dtos = paginatedPrescriptions.Items.Select(p => new PrescriptionDto
        {
            Id = p.Id,
            AppointmentId = p.AppointmentId,
            PatientId = p.PatientId,
            ProfessionalId = p.ProfessionalId,
            PdfUrl = p.PdfUrl,
            Title = p.Title,
            Notes = p.Notes,
            IssuedAt = p.IssuedAt,
            CreatedAt = p.CreatedAt,
            Professional = professionalsMap.TryGetValue(p.ProfessionalId, out var prof)
                ? new ProfessionalInfoDto
                {
                    FirstName = prof.FirstName,
                    LastName = prof.LastName,
                    ProfilePictureUrl = prof.ProfilePictureUrl,
                    Specialization = prof.SpecializationKey
                }
                : null
        }).ToList();

        return Result<PaginationResultDto<PrescriptionDto>>.Success(new PaginationResultDto<PrescriptionDto>
        {
            Items = dtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = paginatedPrescriptions.TotalCount
        });
    }
}
