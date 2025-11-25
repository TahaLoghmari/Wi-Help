using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain.Entities;
using Modules.Appointments.Infrastructure.Database;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetPatientAppointments;

public sealed class GetPatientAppointmentsQueryHandler(
    AppointmentsDbContext dbContext,
    IPatientsModuleApi patientsApi,
    IProfessionalModuleApi professionalApi)
    : IQueryHandler<GetPatientAppointmentsQuery, PaginationResultDto<GetPatientAppointmentsDto>>
{
    public async Task<Result<PaginationResultDto<GetPatientAppointmentsDto>>> Handle(
        GetPatientAppointmentsQuery query,
        CancellationToken cancellationToken)
    {
        // Get patientId from userId
        var patientResult = await patientsApi.GetPatientByUserIdAsync(query.UserId, cancellationToken);
        if (patientResult.IsFailure)
        {
            return Result<PaginationResultDto<GetPatientAppointmentsDto>>.Failure(patientResult.Error);
        }

        var patientId = patientResult.Value.Id;

        IQueryable<Appointment> baseQuery = dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.StartDate);
        
        // Pagination
        PaginationResultDto<Appointment> paginatedAppointments = await PaginationResultDto<Appointment>.CreateAsync(
            baseQuery, query.Page, query.PageSize, cancellationToken);

        // get all professionalIds from current patient's appointments
        var professionalIds = paginatedAppointments.Items.Select(a => a.ProfessionalId).Distinct().ToList();
        
        // get all professional data from current patient's appointments using professionalIds
        var professionalsResult = await professionalApi.GetProfessionalsByIdsAsync(professionalIds, cancellationToken);
        if (!professionalsResult.IsSuccess)
        {
            return Result<PaginationResultDto<GetPatientAppointmentsDto>>.Failure(professionalsResult.Error);
        }

        // Every ProfessionalDto that has an appointment with this patient
        Dictionary<Guid, ProfessionalDto> professionalsMap = professionalsResult.Value.ToDictionary(p => p.Id);
        
        var dtos = paginatedAppointments.Items.Select(a => a.ToDto(professionalsMap)).ToList();

        return Result<PaginationResultDto<GetPatientAppointmentsDto>>.Success(new PaginationResultDto<GetPatientAppointmentsDto>
        {
            Items = dtos,
            Page = paginatedAppointments.Page,
            PageSize = paginatedAppointments.PageSize,
            TotalCount = paginatedAppointments.TotalCount
        });
    }
}
