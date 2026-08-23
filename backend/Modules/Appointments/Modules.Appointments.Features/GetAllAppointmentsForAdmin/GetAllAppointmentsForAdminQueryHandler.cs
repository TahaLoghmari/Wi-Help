using Modules.Appointments.Domain.Ports;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetAllAppointmentsForAdmin;

public sealed class GetAllAppointmentsForAdminQueryHandler(
    IGetAllAppointmentsForAdminStore appointmentsStore,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetAllAppointmentsForAdminQuery, PaginationResultDto<GetAllAppointmentsForAdminDto>>
{
    public async Task<Result<PaginationResultDto<GetAllAppointmentsForAdminDto>>> Handle(
        GetAllAppointmentsForAdminQuery query,
        CancellationToken cancellationToken)
    {
        var appointmentsPage = await appointmentsStore.GetAsync(query.Page, query.PageSize, cancellationToken);
        var appointments = appointmentsPage.Items;

        // Get unique patient and professional IDs
        var patientIds = appointments.Select(a => a.PatientId).Distinct().ToList();
        var professionalIds = appointments.Select(a => a.ProfessionalId).Distinct().ToList();

        // Fetch patients and professionals data
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        if (patientsResult.IsFailure)
        {
            return Result<PaginationResultDto<GetAllAppointmentsForAdminDto>>.Failure(patientsResult.Error);
        }

        var professionalsResult = await professionalApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        if (professionalsResult.IsFailure)
        {
            return Result<PaginationResultDto<GetAllAppointmentsForAdminDto>>.Failure(professionalsResult.Error);
        }

        // Create lookup dictionaries
        var patientsMap = patientsResult.Value.ToDictionary(p => p.Id);
        var professionalsMap = professionalsResult.Value.ToDictionary(p => p.Id);

        // Map to DTOs
        var appointmentDtos = appointments.Select(a =>
        {
            var patient = patientsMap.GetValueOrDefault(a.PatientId);
            var professional = professionalsMap.GetValueOrDefault(a.ProfessionalId);

            if (patient == null || professional == null) return null;

            return new GetAllAppointmentsForAdminDto(
                a.Id,
                a.PatientId,
                a.ProfessionalId,
                a.Notes,
                a.StartDate,
                a.EndDate,
                a.Urgency,
                a.Status,
                a.Price,
                a.OfferedAt,
                a.ConfirmedAt,
                a.CompletedAt,
                a.CancelledAt,
                a.CreatedAt,
                a.UpdatedAt,
                professional,
                patient
            );
        }).Where(d => d != null).Cast<GetAllAppointmentsForAdminDto>().ToList();

        return Result<PaginationResultDto<GetAllAppointmentsForAdminDto>>.Success(
            new PaginationResultDto<GetAllAppointmentsForAdminDto>
            {
                Items = appointmentDtos,
                TotalCount = appointmentsPage.TotalCount,
                Page = query.Page,
                PageSize = query.PageSize
            });
    }
}
