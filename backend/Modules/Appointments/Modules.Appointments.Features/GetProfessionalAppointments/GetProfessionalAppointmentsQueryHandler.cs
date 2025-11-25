using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;
using Modules.Professionals.PublicApi;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public sealed class GetProfessionalAppointmentsQueryHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetProfessionalAppointmentsQuery, PaginationResultDto<GetProfessionalAppointmentsDto>>
{
    public async Task<Result<PaginationResultDto<GetProfessionalAppointmentsDto>>> Handle(
        GetProfessionalAppointmentsQuery query,
        CancellationToken cancellationToken)
    {
        // Get professionalId from userId
        var professionalResult = await professionalApi.GetProfessionalByUserIdAsync(query.UserId, cancellationToken);
        if (professionalResult.IsFailure)
        {
            return Result<PaginationResultDto<GetProfessionalAppointmentsDto>>.Failure(professionalResult.Error);
        }

        var professionalId = professionalResult.Value.Id;

        IQueryable<Appointment> baseQuery = dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.ProfessionalId == professionalId)
            .OrderByDescending(a => a.StartDate);
        
        // Pagination
        PaginationResultDto<Appointment> paginatedAppointments = await PaginationResultDto<Appointment>.CreateAsync(
            baseQuery, query.Page, query.PageSize, cancellationToken);

        // get all patientIds from current professional's appointments
        var patientIds = paginatedAppointments.Items.Select(a => a.PatientId).Distinct().ToList();
        
        // get all patient data from current professional's appointments using patientIds
        var patientsResult = await patientsApi.GetPatientsByIdsAsync(patientIds, cancellationToken);
        if (!patientsResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetProfessionalAppointmentsDto>>.Failure(patientsResult.Error);
        }

        // Every PatientDto that has an appointment with this professional
        Dictionary<Guid, PatientDto> patientsMap = patientsResult.Value.ToDictionary(p => p.Id);
        
        var dtos = paginatedAppointments.Items.Select(a => a.ToDto(patientsMap)).ToList();

        return Result<PaginationResultDto<GetProfessionalAppointmentsDto>>.Success(new PaginationResultDto<GetProfessionalAppointmentsDto>
        {
            Items = dtos,
            Page = paginatedAppointments.Page,
            PageSize = paginatedAppointments.PageSize,
            TotalCount = paginatedAppointments.TotalCount
        });
    }
}
